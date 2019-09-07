const createError = require('http-errors');
const { body, validationResult, sanitizeBody } = require('express-validator');
// Libraries
const { createValidationError } = require('../lib/errors');
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');
// Models
const Artefact = require('../models/artefact');

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


exports.getArtefact = [
	// Must be logged in
	oauth2.required,

	(req, res, next) => {
		Artefact
			.findById(req.params.id)
			.populate(Artefact.ownerPopulation)
			.exec((err, artefact) => {
				if (err) {
					res.status(500).send(err);
				} else if (artefact === null || artefact === undefined) {
					// Error getting Artefact
					res.status(500).send('Cannot find artefact');
				} else if (req.user.id.toString() === artefact.owner.id.toString()) {
					// User is owner
					const outputArtefact = artefact.toJSON();
					outputArtefact.isOwner = true;
					res.json(outputArtefact);
				} else if (artefact.viewers.find((x) => x.id.toString() === req.user.id.toString())) {
					// User is viewer, restrict access
					Artefact
						.findById(req.params.id, Artefact.viewerRestrictions)
						.populate(Artefact.viewerPopulation)
						.exec((viewerErr, viewerArtefact) => {
							if (err) {
								res.status(500).send(err);
							} else if (artefact === null || artefact === undefined) {
								// Error getting Artefact
								res.status(500).send('Cannot find artefact');
							} else {
								// Send restricted artefact
								const outputArtefact = viewerArtefact.toJSON();
								outputArtefact.isOwner = false;
								res.json(outputArtefact);
							}
						});
				} else {
					// User is not owner, create error
					res.status(403).send('You do not have permission to access this artefact.');
				}
			});
	},
];

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
