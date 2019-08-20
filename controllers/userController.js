const mongoose = require('mongoose');

const User = mongoose.model('user');
const Page = mongoose.model('artefactpage');

/** Insert one user into the database from a profile */
const insertUser = (profile, callback) => {
	const user = new User({
		user_id: profile.id,
	});

	user.save((err, result) => {
		callback({
			err,
			result: [result],
		});
	});
};

// Find contacts by name
const findUser = (id, callback) => {
	User.find({ user_id: id }, (err, info) => {
		callback({
			error: err,
			result: info,
		});
	});
};

// Find user or create if doesn't exist
const findOrCreateUser = (profile, callback) => {
	findUser(profile.id, (msg) => {
		if (msg.error || msg.result.length === 0) {
			insertUser(profile, callback);
		} else {
			callback(msg);
		}
	});
};

const updateUser = (id, user, callback) => {
	User.updateOne({ user_id: id }, user, (err, result) => {
		callback({
			error: err,
			result,
		});
	});
};

// Delete one contact by id
const deleteUser = (id, callback) => {
	User.deleteOne({ user_id: id }, (err) => {
		callback({
			error: err,
			result: 'Deleted',
		});
	});
};

/**
 * Get the user that is currently logged in, or null if no user is logged in
 */
const getUser = (req, callback) => {
	if (req.session && req.session.passport && req.session.passport.user) {
		findUser(req.session.passport.user, (msg) => {
			if (!msg.error && msg.result.length > 0) {
				callback(msg.result[0]);
			} else {
				callback(null);
			}
		});
	} else {
		callback(null);
	}
};


const createPage = (req, callback) => {
	const pageName = req.body.pagename;

	// Check page name
	if (!pageName || pageName === '') {
		callback({ error: 'Must include a page name', result: null });
	} else if (req.session && req.session.passport && req.session.passport.user) {
		findUser(req.session.passport.user, (msg) => {
			if (!msg.error && msg.result.length > 0) {
				const user = msg.result[0];
				if (user && user.pages) {
					const page = new Page({
						name: pageName,
					});

					user.pages.push(page);
					updateUser(user.user_id, user, (msgUpdate) => callback(msgUpdate));
				} else {
					callback(msg);
				}
			} else {
				callback(msg);
			}
		});
	} else {
		callback({ error: 'User not signed in', result: null });
	}
};

const deletePage = (req, callback) => {
	const pageId = req.params.id;
	// Check page name
	if (!pageId || pageId === '') {
		callback({ error: 'Must include a page id', result: null });
	} else if (req.session && req.session.passport && req.session.passport.user) {
		findUser(req.session.passport.user, (msg) => {
			if (!msg.error && msg.result.length > 0) {
				const user = msg.result[0];
				if (user && user.pages) {
					user.pages = user.pages.filter((el) => el._id && el._id.toString() !== pageId.toString());
					updateUser(user.user_id, user, (msgUpdate) => callback(msgUpdate));
				} else {
					callback(msg);
				}
			} else {
				callback(msg);
			}
		});
	} else {
		callback({ error: 'User not signed in', result: null });
	}
};


// Exporting callbacks
module.exports = {
	getUser,
	findUser,
	insertUser,
	findOrCreateUser,
	updateUser,
	deleteUser,

	createPage,
	deletePage,
};
