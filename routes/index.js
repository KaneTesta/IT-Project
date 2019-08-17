const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();


/**
 * Get the user that is currently logged in, or null if no user it logged in
 */
function getUser(req, callback) {
	if (req.session && req.session.passport && req.session.passport.user) {
		userController.findUser(req.session.passport.user, (msg) => {
			if (!msg.error && msg.result.length > 0) {
				callback(msg.result[0]);
			} else {
				callback(null);
			}
		});
	} else {
		callback(null);
	}
}

/* GET home page. */
router.get('/', (req, res, next) => {
	getUser(req, (user) => {
		if (user) {
			res.render('user/dashboard', { title: 'Inherit That', user });
		} else {
			res.render('index', { title: 'Inherit That', user });
		}
	});
});

/* GET page for item page. */
router.get('/page/:id', (req, res, next) => {
	getUser(req, (user) => {
		if (user && user.pages) {
			const page = user.pages.find((el) => el.page_id.toString() === req.params.id.toString());

			if (page) {
				res.render('user/page', { title: 'Inherit That', user, page });
			} else {
				res.status(403).send("This page doesn't exist, or you don't have permission to access it.");
			}
		} else {
			res.redirect('/');
		}
	});
});

module.exports = router;
