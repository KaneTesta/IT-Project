const mongoose = require('mongoose');
const async = require('async');
const Artefact = require('./artefact');

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

// Gets owned and viewable artefacts for a given user
userSchema.statics.getArtefacts = function getArtefacts(id, done) {
	async.parallel({
		owner: function owner(callback) {
			Artefact.find({ owner: id }).sort('name').exec(callback);
		},
		viewer: function viewer(callback) {
			Artefact.find({ viewers: id }, Artefact.viewerRestrictions).sort('name').exec(callback);
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
