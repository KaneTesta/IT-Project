const createError = require('http-errors');
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * Send a response message using a given msg object and a Response object
 * @param {{error, result}} msg The msg object to use as a response
 * @param {Response} res The Response to send the message over
 */
function sendResponse(msg, res, next) {
	if (msg.error) {
		next(createError(500, msg.error));
	} else {
		res.redirect('/');
	}
}

/* GET error with user login */
router.get('/loginerror', (req, res, next) => {
	next(createError(500, 'An error occurred while logging you in'));
});

/* POST delete user */
router.post('/delete', (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		const userId = req.session.passport.user;
		userController.deleteUser(userId, (msg) => { sendResponse(msg, res, next); });
	} else {
		next(createError(500, "You can't do this unless you are logged in"));
	}
});

/* POST logout user */
router.post('/logout', (req, res, next) => {
	req.logout();
	req.session.destroy((err) => {
		if (err) {
			next(createError(500, 'An error occurred while logging you out'));
		} else {
			res.redirect('/');
		}
	});
});


/* POST create new item page for current user */
router.post('/createpage', (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		userController.createPage(req, (msg) => { sendResponse(msg, res, next); });
	} else {
		next(createError(500, "You can't do this unless you are logged in"));
	}
});

/* POST delete an existing item page */
router.post('/deletepage/:id', (req, res, next) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		userController.deletePage(req, (msg) => { sendResponse(msg, res, next); });
	} else {
		next(createError(500, "You can't do this unless you are logged in"));
	}
});

module.exports = router;
