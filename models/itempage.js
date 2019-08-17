const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
	page_id: {
		type: mongoose.Types.ObjectId,
		requre: [true, 'A page needs an id'],
	},
	page_name: {
		type: String,
		require: [true, 'A page needs a name'],
	},
});

mongoose.model('itempage', pageSchema);
