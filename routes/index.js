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
			res.render('dashboard', { title: 'Inherit That', user });
		} else {
			res.render('index', { title: 'Inherit That', user });
		}
	});
});

module.exports = router;
