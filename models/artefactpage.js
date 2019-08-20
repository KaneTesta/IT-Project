const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		auto: true,
	},
	name: {
		type: String,
		require: [true, 'A page needs a name'],
	},
	artefacts: {
		type: Array,
		ref: 'artefact',
	},
});

mongoose.model('artefactpage', pageSchema);
