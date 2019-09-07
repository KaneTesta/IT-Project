const mongoose = require('mongoose');
const images = require('../lib/images');

const imageSchema = mongoose.Schema({
	filename: String,
}, { toJSON: { virtuals: true } });

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
	viewers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
});

artefactSchema.statics.viewerRestrictions = 'name description owner images.item';
artefactSchema.statics.ownerPopulation = 'owner viewers';
artefactSchema.statics.viewerPopulation = 'owner';

module.exports = mongoose.model('Artefact', artefactSchema);
