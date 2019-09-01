const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');
const Artefact = require('../models/artefact');

function checkOwner(req, res, next) {
	Artefact.findById(req.params.id, (err, artefact) => {
		if (err) next(err);
		if (req.user.id === artefact.owner) {
			next();
		} else {
			// Not sure how to handle this, forward the error with next or just redirect?
			const error = new Error('You do not have permission to modify this artefact');
			error.statusCode = 403;
			res.redirect('/user/dashboard');
		}
	});
}

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
			image: req.file.cloudStorageObject,
			owner: req.user.id,
		});

		if (!errors.isEmpty()) {
			next(errors);
		} else {
			artefact.save((err) => {
				if (err) next(err);
				res.redirect('/user/dashboard');
			});
		}
	},
];

exports.editArtefact = [
	oauth2.required,
	checkOwner,
	// Validate Body
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
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			next(errors);
		} else {
			Artefact.findByIdAndUpdate(req.params.id, artefact, (err) => {
				if (err) next(err);
				res.redirect('/user/dashboard');
			});
		}
	},
];

exports.deleteArtefact = [
	oauth2.required,
	checkOwner,
	(req, res, next) => {
		Artefact.findByIdAndDelete(req.params.id, (err) => {
			if (err) next(err);
			res.redirect('/user/dashboard');
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
				if (err) next(err);
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
				if (err) next(err);
				res.json(artefact);
			});
	},
];
