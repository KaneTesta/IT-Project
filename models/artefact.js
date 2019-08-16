const mongoose = require('mongoose');

const artefactSchema = mongoose.Schema({
	name: String,
	description: String,
	image: String,
});

mongoose.model('artefact', artefactSchema);
