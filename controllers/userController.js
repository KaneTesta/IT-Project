const createError = require('http-errors');
const oauth2 = require('../lib/oauth2');

const User = require('../models/user');

// Get all of the artefacts that are owned by a user
exports.getUserDashboard = [
	// Must be logged in
	oauth2.required,

	// Get dashboard
	(req, res, next) => {
		User.getArtefacts(req.user.id, (err, artefacts) => {
			if (!err) {
				res.render('user/dashboard', { title: 'Dashboard', user: req.user, artefacts });
			} else {
				next(createError(500, err));
			}
		});
	},
];

// Search for users in the user database so we can
// alter the visibility of an artefact to include them
exports.searchUsers = [
	// Get dashboard
	(req, res, next) => {
		const { query } = req.params;
		if (!query) {
			res.status(400).send('Must have a search query');
		} else {
			User.find({ $text: { $search: query } }, (err, users) => {
				if (err) {
					res.status(500).send(err);
				} else {
					res.json(users);
				}
			});
		}
	},
];

// Get all users in database
exports.getAllUsers = (req, res, next) => {
	User.find({}, 'display_name email', (err, users) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json(users);
		}
	});
};
