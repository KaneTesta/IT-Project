const mongoose = require('mongoose');
const async = require('async');
const Artefact = require('./artefact');

const userSchema = mongoose.Schema({
	user_id: {
		type: String,
		require: [true, 'A user needs an id'],
	},
	display_name: String,
	display_picture: String,
	email: String,
});

// Gets owned and viewable artefacts for a given user
userSchema.statics.getArtefacts = function getArtefacts(id, done) {
	async.parallel({
		owner: function owner(callback) {
			Artefact.find({ owner: id }).exec(callback);
		},
		viewer: function viewer(callback) {
			Artefact.find({ viewer: id }, Artefact.viewerRestrictions).exec(callback);
		},
	}, (err, artefacts) => {
		done(err, artefacts);
	});
};

module.exports = mongoose.model('User', userSchema);
