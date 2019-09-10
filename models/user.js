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
	}, (err, artefacts) => {
		done(err, artefacts);
	});
};

// Gets visible artefact data visible for a given viewer
userSchema.statics.getArtefact = function getArtefact(userId, artefactId, done) {
	userSchema.statics.getArtefacts(userId, (err, artefacts) => {
		if (err) {
			done(err, null);
		} else {
			// Define function for matching artefacts with the given id
			const artefactMatch = (artefact) => artefact._id.toString() === artefactId.toString();
			// Check if the user owns or can view an artefact with the given id
			const ownerArtefact = artefacts.owner.find(artefactMatch);
			const viewerArtefact = artefacts.viewer.find(artefactMatch);
			// Return the artefact
			if (ownerArtefact) {
				ownerArtefact.isOwner = true;
				done(err, ownerArtefact);
			} else if (viewerArtefact) {
				viewerArtefact.isOwner = false;
				done(err, viewerArtefact);
			} else {
				done(err, null);
			}
		}
	});
};

// Create index on name and email for searching
userSchema.index({
	display_name: 'text',
	email: 'text',
});

module.exports = mongoose.model('User', userSchema);
