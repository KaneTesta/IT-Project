const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	user_id: {
		type: String,
		require: [true, 'An user needs an id'],
	},
	display_name: String,
	display_picture: String,
	pages: {
		type: Array,
		ref: 'artefactpage',
	},
});

mongoose.model('user', userSchema);
