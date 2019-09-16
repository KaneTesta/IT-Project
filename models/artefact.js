const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const artefactSchema = mongoose.Schema({
	name: String,
	description: String,
	image: String,
	documentation: [String],
	insurance: [String],
	tags: [String],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	read_access: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
});



artefactSchema.plugin(mongoosePaginate);
mongoose.model('artefact', artefactSchema);

artefactSchema.statics.uniquetags = function() {
	return this.distinct('tags');
}
