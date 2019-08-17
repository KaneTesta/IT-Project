const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({
	page_name: {
		type: String,
		require: [true, 'A page needs an name'],
	},
	page_color: {
		type: String,
		require: [true, 'A page needs a color'],
	},
});

mongoose.model('itempage', pageSchema);
