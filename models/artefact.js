const mongoose = require('mongoose');
const images = require('../lib/images');

const imageSchema = mongoose.Schema({
	filename: String,
});

imageSchema.pre('remove', function deleteImage(next) {
	images.deleteFromGCS(this.image).then(next());
});

imageSchema.virtual('url').get(function getImageUrl() {
	return images.getPublicUrl(this.filename);
});

const artefactSchema = mongoose.Schema({
	name: String,
	description: String,
	// TODO Decide on map of arrays for future additions or as is
	// TODO add ability to upload files (pdf?) too?
	images: {
		item: imageSchema,
		documentation: [imageSchema],
		insurance: [imageSchema],
	},
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

artefactSchema.statics.viewerRestrictions = 'name description';

module.exports = mongoose.model('Artefact', artefactSchema);
