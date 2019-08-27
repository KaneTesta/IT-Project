const createError = require('http-errors');
const express = require('express');
const pageController = require('../controllers/pageController');
const imageUploader = require('../lib/images');

const router = express.Router();

/**
 * Send a response message using a given msg object and a Response object
 * @param {{error, result}} msg The msg object to use as a response
 * @param {Response} res The Response to send the message over
 */
function sendResponse(msg, req, res, next) {
	if (msg.error) {
		next(createError(500, msg.error));
	} else if (req.params.id) {
		res.redirect(`/page/${req.params.id}`);
	} else {
		res.redirect('/');
	}
}

/* POST update data for current user's page with id */
router.post('/:id/updatepage', (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		pageController.updatePage(req, (msg) => { sendResponse(msg, req, res, next); });
	} else {
		next(createError(500, "You can't do this unless you are logged in"));
	}
});

/* POST create new artefact page for current user */
router.post('/:id/addartefact', imageUploader.sendUploadToGCS, (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		pageController.addArtefact(req, (msg) => { sendResponse(msg, req, res, next); });
	} else {
		next(createError(500, "You can't do this unless you are logged in"));
	}
});

/* POST create new artefact page for current user */
router.post('/:id/deleteartefact', (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		pageController.deleteArtefact(req, (msg) => { sendResponse(msg, req, res, next); });
	} else {
		next(createError(500, "You can't do this unless you are logged in"));
	}
});

/* GET data for an artefact for the current user */
router.get('/:pageid/artefact/:artefactid', (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		pageController.getArtefact(req, (msg) => {
			if (msg.error) {
				res.status(500).send(msg.error);
			} else {
				res.send(JSON.stringify(msg.result));
			}
		});
	} else {
		res.status(500).send("You can't do this unless you are logged in");
	}
});

module.exports = router;
