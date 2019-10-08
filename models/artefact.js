const mongoose = require('mongoose');
const images = require('../lib/images');

// Schema for image objects
// Inputs:
// filename - name of the file
const imageSchema = mongoose.Schema({
	filename: String,
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

imageSchema.pre('remove', { query: true, document: true }, function deleteImage(next) {
	images.deleteFromGCS(this.image).then(next());
});

imageSchema.virtual('url').get(function getImageUrl() {
	return images.getPublicUrl(this.filename);
});

// Schema for artefact objects
// Inputs:
// name: name of the artefact set by user
// description: description of artefact set by user
// images: supporting files for the artefact including the item's images,
//         documentation and / or insurance files
// tags: categories to help filter the artefact by
// owner: user data of the owner
// viewers: user's who have read-only accessibility
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

// Can be directly invoked by a model
artefactSchema.statics.viewerRestrictions = 'name description owner images.item';
artefactSchema.statics.ownerPopulation = 'owner viewers';
artefactSchema.statics.viewerPopulation = 'owner';

module.exports = mongoose.model('Artefact', artefactSchema);
