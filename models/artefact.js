const mongoose = require('mongoose');
const gcs = require('../lib/gcs');

// Schema for image objects
// Inputs:
// filename - name of the file
const fileSchema = mongoose.Schema({
	filename: String,
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

fileSchema.virtual('url').get(function getFileUrl() {
	return gcs.getPublicUrl(this.filename);
});

fileSchema.pre('remove', { query: true, document: true }, function deleteImage(next) {
	gcs.deleteFromGCS(this.filename).then(next());
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
	// Probably a better way to organise this
	images: {
		item: fileSchema,
		other: [fileSchema],
	},
	files: [fileSchema],
	tags: [String],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	viewers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	recipients: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
});

artefactSchema.pre('remove', function cleanUpFiles(next) {
	if (this.images.item) this.images.item.remove();
	this.images.other.forEach((item) => item.remove());
	this.files.forEach((file) => file.remove());
	next();
});

// Can be directly invoked by a model
artefactSchema.statics.viewerRestrictions = 'name description owner images.item';
artefactSchema.statics.ownerPopulation = 'owner viewers';
artefactSchema.statics.viewerPopulation = 'owner';

module.exports = mongoose.model('Artefact', artefactSchema);
