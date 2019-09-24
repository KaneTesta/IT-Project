const createError = require('http-errors');
const { body, validationResult, sanitizeBody } = require('express-validator');

// Libraries
const { createValidationError } = require('../lib/errors');
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');

// Models
const Artefact = require('../models/artefact');

//Check if a user is the owner of the artefact, based on their session (login) information. If they aren't the owner of an artefact, don't let them make changes
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

// Get artefact if user is the owner
exports.getArtefact = [
	// Must be logged in
	oauth2.required,

	(req, res, next) => {
		Artefact.findById(req.params.id, (err, artefact) => {
			if (err) {
				res.status(500).send(err);
			} else if (artefact) {
				if (String(artefact.owner) === String(res.locals.profile.id)) {
					// User is owner
					res.json(artefact);
				} else if ((artefact.viewers.some((v) => String(v.id) === String(res.locals.profile.id)))) {
					// User is viewer
					res.json(artefact.toJSON({
						transform: (doc, ret, options) => {
							// Filter out elements we don't want viewer's to see
							ret.images.documentation = [];
							ret.images.insurance = [];
						},
					}));
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
	images.multer.single('image'),
	images.sendUploadToGCS,

	// Validate Body
	body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
	body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),

	// Sanitise Body
	sanitizeBody('*').escape(),

	// Continue
	(req, res, next) => {
		const errors = validationResult(req);

		// Artefact object
		// Inputs:
		// Name - Name of the object to be displayed on dashboard
		// Description - Description of the object 
		// Tags - Categories that we want to identify our object with
		// Owner - user ID of the owner of the artefact
		const artefact = new Artefact({
			name: req.body.name,
			description: req.body.description,
			tags: req.body.tags,
			owner: req.user.id,
		});

		if (req.file) {
			artefact.images.item = { filename: req.file.cloudStorageObject };
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

//Edit's an artefact if it belongs to the user in the session
exports.editArtefact = [
	// Must be logged in
	oauth2.required,

	// Upload image
	images.multer.single('image'),
	images.sendUploadToGCS,

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
					artefact.tages = req.body.tags;
					// Update image
					if (req.file) {
						artefact.images.item = { filename: req.file.cloudStorageObject };
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

//Deletes artefact if owned by user
exports.deleteArtefact = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		Artefact.findByIdAndDelete(req.body.id, (err) => {
			if (err) {
				next(createError(500, err));
			} else {
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
