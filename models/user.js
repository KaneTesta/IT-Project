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

userSchema.pre('remove', function deleteArtefacts(next) {
	Artefact.deleteMany({ owner: this._id }).then(next);
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
