const createError = require('http-errors');
const { body, validationResult, sanitizeBody } = require('express-validator');
const { createValidationError } = require('../lib/errors');
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');
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
		Artefact.findById(req.params.id, (err, artefact) => {
			if (err) {
				next(createError(500, err));
			} else {
				res.json(artefact);
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
				if (err) next(createError(500, err));
				res.redirect('/user/');
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

		const artefact = new Artefact({
			name: req.body.name,
			description: req.body.description,
			tags: req.body.tags,
			owner: req.user.id,
			_id: req.body.id,
		});

		if (req.file) {
			artefact.images.item = { filename: req.file.cloudStorageObject };
		} else if (req.body.imagename) {
			artefact.images.item = { filename: req.body.imagename };
		}

		if (!errors.isEmpty()) {
			next(createValidationError(errors));
		} else {
			Artefact.findByIdAndUpdate(req.body.id, artefact, (err) => {
				if (err) next(createError(500, err));
				res.redirect('/user/');
			});
		}
	},
];

exports.deleteArtefact = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		Artefact.findByIdAndDelete(req.body.id, (err) => {
			if (err) next(createError(500, err));
			res.redirect('/user/');
		});
	},
];

exports.addViewer = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		const { viewerId, artefactId } = req.body;

		Artefact.findByIdAndUpdate(artefactId,
			{ $push: { viewers: viewerId } },
			(err, artefact) => {
				if (err) next(createError(500, err));
				res.json(artefact);
			});
	},
];


exports.removeViewer = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		const { viewerId, artefactId } = req.body;

		Artefact.findByIdAndUpdate(artefactId,
			{ $pull: { viewers: viewerId } },
			(err, artefact) => {
				if (err) next(createError(500, err));
				res.json(artefact);
			});
	},
];
