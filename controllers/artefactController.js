const createError = require('http-errors');
const { body, validationResult, sanitizeBody } = require('express-validator');
const archiver = require('archiver');
const csvStringify = require('csv-stringify');

// Libraries
const { createValidationError } = require('../lib/errors');
const gcs = require('../lib/gcs');
const oauth2 = require('../lib/oauth2');

// Models
const Artefact = require('../models/artefact');

// Check if a user is the owner of the artefact, based on their session (login) information.
// If they aren't the owner of an artefact, don't let them make changes
const checkOwner = [
	// Must be logged in
	oauth2.required,
	// Validate Body
	body('id', 'Id must not be empty.').isLength({ min: 1 }).trim(),

	(req, res, next) => {
		const errors = validationResult(req);

		Artefact.findById(req.body.id, (err, artefact) => {
			if (!errors.isEmpty()) {
				// Validation errors
				next(createValidationError(errors));
			} else if (err) {
				// Error getting Artefact
				next(createError(500, err));
			} else if (artefact === null || artefact === undefined) {
				// Error getting Artefact
				next(createError(500, 'Cannot find artefact'));
			} else if (req.user.id.toString() === artefact.owner.toString()) {
				// User is owner, keep going
				next();
			} else {
				// User is not owner, create error
				next(createError(403, 'You do not have permission to modify this artefact'));
			}
		});
	},
];

exports.getDistinctTags = [
	(req, res, next) => {
		Artefact.distinct('tags', (err, tags) => {
			if (err) {
				res.status(500).send(err);
			}
			// tags is an array of all distinct tags
			// res.json(tags);
			res.json(tags);
		});
	},
];


// Get artefact if user is the owner
exports.getArtefact = [
	// Must be logged in
	oauth2.required,

	(req, res, next) => {
		Artefact.findById(req.params.id)
			.populate('owner', '-email')
			.populate('viewers', '-email')
			.exec((err, artefact) => {
				const a = artefact.toObject();
				if (err) {
					res.status(500).send(err);
				} else if (artefact) {
					const ownerId = String(artefact.owner.id);
					const profileId = String(res.locals.profile.id);
					const isOwner = ownerId === profileId;
					const isViewer = artefact.viewers.some((v) => String(v.id) === profileId);
					a.isOwner = isOwner;
					if (isOwner) {
						res.json(a);
					} else if (isViewer) {
						delete a.viewers;
						delete a.images.documentation;
						delete a.images.insurance;
						res.json(a);
					} else {
						// Not an owner or viewer
						next(createError(403, 'You do not have permission to view this artefact'));
					}
				} else {
					// Error getting Artefact
					res.status(500).send('Cannot find artefact');
				}
			});
	},
	(err, req, res, next) => {
		res.status(500).send(err);
	},
];

// Create and save an artefact object to the user that is logged in's GCS
exports.createArtefact = [
	// Must be logged in
	oauth2.required,

	// Upload image
	gcs.multer.fields([{ name: 'image', maxCount: 1 }, { name: 'other' }]),
	gcs.uploadFilesToGCS,

	// Validate Body
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
	body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),

	// Sanitise Body
	sanitizeBody('*').escape(),

	// Continue
	(req, res, next) => {
		const errors = validationResult(req);
		// Set tags for artefact
		let artefactTags;
		if (req.body.tags) {
			artefactTags = req.body.tags.split(',').map((tag) => tag.trim());
		}

		// Artefact object
		// Inputs:
		// Name - Name of the object to be displayed on dashboard
		// Description - Description of the object
		// Tags - Categories that we want to identify our object with
		// Owner - user ID of the owner of the artefact
		const artefact = new Artefact({
			name: req.body.name,
			description: req.body.description,
			tags: artefactTags,
			owner: req.user.id,
		});


		if (req.files.image) {
			artefact.images.item = { filename: req.files.image[0].originalname };
		}

		if (req.files.other && Array.isArray(req.files.other)) {
			artefact.files = req.files.other.map((f) => ({ filename: f.originalname }));
		}

		if (!errors.isEmpty()) {
			next(createValidationError(errors));
		} else {
			artefact.save((err) => {
				if (err) {
					next(createError(500, err));
				} else {
					res.redirect('/user/');
				}
			});
		}
	},
];

// Edit's an artefact if it belongs to the user in the session
exports.editArtefact = [
	// Must be logged in
	oauth2.required,

	// Upload image
	gcs.multer.fields([{ name: 'image', maxCount: 1 }, { name: 'other' }]),
	gcs.uploadFilesToGCS,

	// Check permissions
	checkOwner,

	// Validate Body
	body('id', 'Id must not be empty.').isLength({ min: 1 }).trim(),
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
	body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),

	// Sanitise Body
	sanitizeBody('*').escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			next(createValidationError(errors));
		} else {
			Artefact.findById(req.body.id, (err, artefact) => {
				if (err) {
					next(createError(500, err));
				} else {
					// Update artefact values
					artefact.name = req.body.name;
					artefact.description = req.body.description;
					// Update tags
					if (req.body.tags) {
						artefact.tags = req.body.tags.split(',').map((tag) => tag.trim());
					}

					// Update image
					if (req.files.image) {
						artefact.images.item = { filename: req.files.image[0].originalname };
					}

					// Add files
					if (req.files.other && Array.isArray(req.files.other)) {
						artefact.files.push(req.files.other.map((f) => ({ filename: f.originalname })));
					}

					// Save modified artefact
					artefact.save((errSave) => {
						if (errSave) {
							next(createError(500, errSave));
						} else {
							res.redirect('/user/');
						}
					});
				}
			});
		}
	},
];

// Deletes artefact if owned by user
exports.deleteArtefact = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		Artefact.findById(req.body.id, (err, artefact) => {
			if (err) {
				next(createError(500, err));
			} else {
				artefact.remove();
				res.redirect('/user/');
			}
		});
	},
];

// Allows specified user to gain viewing access to an artefact
exports.addViewer = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		const { viewerId } = req.body;
		const artefactId = req.body.id;

		if (req.user.id.toString() === viewerId.toString()) {
			res.status(400).send('User is already the owner of this artefact');
		} else {
			Artefact.findByIdAndUpdate(artefactId,
				{ $addToSet: { viewers: viewerId } },
				(err, artefact) => {
					if (err) {
						res.status(500).send(err);
					} else {
						res.json(artefact);
					}
				});
		}
	},

	(err, req, res, next) => {
		res.status(500).send(err);
	},
];

// Disallows specified user to gain viewing access to an artefact
exports.removeViewer = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		const { viewerId } = req.body;
		const artefactId = req.body.id;

		if (req.user.id.toString() === viewerId.toString()) {
			res.status(400).send('User is already owner');
		} else {
			Artefact.findByIdAndUpdate(artefactId,
				{ $pull: { viewers: viewerId } },
				(err, artefact) => {
					if (err) {
						res.status(500).send(err);
					} else {
						res.json(artefact);
					}
				});
		}
	},

	(err, req, res, next) => {
		res.status(500).send(err);
	},
];

exports.getDatabaseZip = [
	oauth2.required,

	(req, res, next) => {
		const zip = archiver('zip');
		// Set up csv stringifier
		const csv = csvStringify({
			header: true,
			columns: [
				{ key: 'name', header: 'Name' },
				{ key: 'description', header: 'Description' },
				{ key: 'images.item.filename', header: 'Image filename' },
				{ key: 'files', header: 'Files' },
			],
			cast: {
				object: (value) => {
					// If stringifying `files` array, concatenate filenames instead of entire object
					if (Array.isArray(value)
						&& value.length !== 0
						&& value[0]
						&& value[0].filename) {
						return value.map((f) => f.filename).join(';');
					}
					return JSON.stringify(value);
				},
			},
		});
		// Set up response to dated backup zip
		res.attachment(`inheritthat_backup_${Date.now()}.zip`);
		// Pipe zip to response as it is created
		zip.pipe(res);
		// Finalise connection on archive end
		zip.on('end', () => res.end());
		// Add csv stream to archive
		zip.append(csv, { name: 'backup.csv' });
		// Stream owned artefacts to zip, finalise on end
		Artefact
			.find({ owner: res.locals.profile.id })
			.select('-viewers -owner -_id -__v')
			.cursor()
			.on('data', (artefact) => {
				// Download and add image if it exists to archive
				if (artefact.images.item) {
					zip.append(gcs.getFileStream(artefact.images.item.filename), {
						name: `files/${artefact.images.item.filename}`,
						store: true,
					});
				}
				if (artefact.files && Array.isArray(artefact.files)) {
					artefact.files.forEach((f) => {
						if (f) {
							zip.append(gcs.getFileStream(f.filename), {
								name: `files/${f.filename}`,
								store: true,
							});
						}
					});
				}
				// Stringify artefact to csv
				csv.write(artefact.toObject());
			})
			.on('end', () => {
				csv.end();
				zip.finalize();
			});
	},
];
