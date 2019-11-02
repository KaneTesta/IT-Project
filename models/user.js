const mongoose = require('mongoose');
const async = require('async');
const Artefact = require('./artefact');

// Mongoose schema used to store each user's data in our mongoDB
const userSchema = mongoose.Schema({
	user_id: {
		type: String,
		index: true,
		unique: true,
		require: [true, 'A user needs an id'],
	},
	display_name: String,
	display_picture: String,
	email: String,
});

// eslint-disable-next-line prefer-arrow-callback
userSchema.pre('remove', function deleteArtefacts(next) {
	async.parallel({
		// Remove owned artefacts
		owner: function deleteOwned(callback) {
			Artefact.deleteMany({ owner: this._id }, callback());
		},
		// Remove viewer permission from artefacts
		viewer: function removeViewPermission(callback) {
			Artefact.find({ viewers: this._id })
				.exec((err, artefacts) => {
					if (!err) {
						artefacts.forEach((artefact) => artefact.viewers.pull(this._id));
					}
					callback(err, artefacts);
				});
		},
		// Remove recipient permission from artefacts
		recipient: function removeRecipientPermission(callback) {
			Artefact.find({ recipients: this._id })
				.exec((err, artefacts) => {
					if (!err) {
						artefacts.forEach((artefact) => artefact.recipients.pull(this._id));
					}
					callback(err, artefacts);
				});
		},
	}, (err, _results) => {
		if (err) next(err);
		else next();
	});
});

// Gets owned and viewable artefacts for a given user
userSchema.statics.getArtefacts = function getArtefacts(userId, done) {
	async.parallel({
		owner: function owner(callback) {
			Artefact.find({ owner: userId })
				.populate(Artefact.ownerPopulation)
				.sort('name')
				.exec(callback);
		},
		viewer: function viewer(callback) {
			Artefact.find({ viewers: userId }, Artefact.viewerRestrictions)
				.populate(Artefact.viewerPopulation)
				.sort('name')
				.exec(callback);
		},
		tags: function tags(callback) {
			Artefact.find({ owner: userId })
				.distinct('tags')
				.exec(callback);
		},
	}, (err, artefacts) => {
		done(err, artefacts);
	});
};

// Create index on name and email for searching
userSchema.index({
	display_name: 'text',
	email: 'text',
});

module.exports = mongoose.model('User', userSchema);
