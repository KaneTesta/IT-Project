const mongoose = require('mongoose');

const artefactSchema = mongoose.Schema({
	name: String,
	description: String,
	image: [String],
	documentation: [String],
	insurance: [String],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	read_access: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
});

mongoose.model('Artefact', artefactSchema);
