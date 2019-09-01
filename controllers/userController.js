const User = require('../models/user');

exports.getUserDashboard = (req, res, next) => {
	User.getArtefacts(req.user.id, (err, artefacts) => {
		if (!err) {
			res.json({ user: req.user, artefacts });
			// render user home with artefacts
		} else {
			next(err);
		}
	});
};

exports.getAllUsers = (req, res, next) => {
	User.find({}, 'display_name email', (err, users) => {
		if (err) next(err);
		res.json(users);
	});
};
