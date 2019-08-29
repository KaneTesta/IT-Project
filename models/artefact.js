const mongoose = require('mongoose');
const images = require('../lib/images');

const artefactSchema = mongoose.Schema({
	name: String,
	description: String,
	image: String,
	documentation: [String],
	insurance: [String],
	tags: [String],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	viewer: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
});

artefactSchema.virtual('imageUrl').get(function getImageUrl() {
	return images.getPublicUrl(this.image);
});

// Delete image from storage on artefact deletion
artefactSchema.pre('remove', (next) => {
	images.deleteFromGCS(this.image).then(next());
});

artefactSchema.statics.viewerRestrictions = 'name description';

module.exports = mongoose.model('Artefact', artefactSchema);
