const createError = require('http-errors');
const User = require('../models/user');

exports.getUserDashboard = (req, res, next) => {
	User.getArtefacts(req.user.id, (err, artefacts) => {
		if (!err) {
			res.render('user/dashboard', { title: 'Dashboard', user: req.user, artefacts });
		} else {
			next(createError(500, err));
		}
	});
};

exports.getAllUsers = (req, res, next) => {
	User.find({}, 'display_name email', (err, users) => {
		if (err) next(createError(500, err));
		res.json(users);
	});
};
