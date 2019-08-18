const mongoose = require('mongoose');

const artefactSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true,
	},
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
