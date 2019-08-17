const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * Send a response message using a given msg object and a Response object
 * @param {{error, result}} msg The msg object to use as a response
 * @param {Response} res The Response to send the message over
 */
function sendResponse(msg, res) {
	if (msg.error) {
		res.status(500).send(msg.error);
	} else {
		res.redirect('/');
	}
}

/* GET error with user login */
router.get('/loginerror', (req, res, next) => {
	res.render('user/loginerror');
});

/* POST delete user */
router.post('/delete', (req, res) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		const userId = req.session.passport.user;
		userController.deleteUser(userId, (msg) => { sendResponse(msg, res); });
	} else {
		res.status(500).send('User not logged in');
	}
});

/* POST logout user */
router.post('/logout', (req, res) => {
	req.logout();
	req.session.destroy((err) => {
		if (err) {
			res.status(500).send('Error logging out');
		} else {
			res.redirect('/');
		}
	});
});


/* POST create new item page for current user */
router.post('/createpage', (req, res) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		userController.createPage(req, (msg) => { sendResponse(msg, res); });
	} else {
		res.status(500).send('User not logged in');
	}
});

/* POST delete an existing item page */
router.post('/deletepage/:id', (req, res) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		userController.deletePage(req, (msg) => { sendResponse(msg, res); });
	} else {
		res.status(500).send('User not logged in');
	}
});

module.exports = router;
