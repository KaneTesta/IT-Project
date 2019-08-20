const mongoose = require('mongoose');

const artefactSchema = mongoose.Schema({
	name: {
		type: String,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	image: String,
});

mongoose.model('artefact', artefactSchema);
