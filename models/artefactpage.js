const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
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
