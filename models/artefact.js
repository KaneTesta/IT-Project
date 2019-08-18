const mongoose = require('mongoose');

const artefactSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true,
	},
	name: String,
	description: String,
	image: String,
});

mongoose.model('artefact', artefactSchema);
