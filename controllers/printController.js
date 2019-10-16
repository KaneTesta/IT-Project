//ADDED BY KANE

const createError = require('http-errors');
const oauth2 = require('../lib/oauth2');

const User = require('../models/user');

// Get all of the artefacts that are owned by a user
exports.getPrintDashboard = [
	// Must be logged in
	oauth2.required,

	// Get dashboard
	(req, res, next) => {
		User.getArtefacts(req.user.id, (err, artefacts) => {
			if (!err) {
				res.render('user/print', { title: 'Dashboard', user: req.user, artefacts });
			} else {
				next(createError(500, err));
			}
		});
	},
];