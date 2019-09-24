const concat = require('concat-stream');
const sharp = require('sharp');

// Converts a file into JPEG and resizes it to width 1024px.
// Compresses file into a buffer
module.exports._handleFile = function _handleFile(req, file, cb) {
	const compressor = sharp()
		.resize({
			width: 1024,
			fit: sharp.fit.contain,
		})
		.jpeg();

	file.stream.pipe(compressor).pipe(concat({ encoding: 'buffer' }, (data) => {
		cb(null, {
			buffer: data,
			size: data.length,
		});
	}));
};

//Deletes file from buffer
module.exports._removeFile = function _removeFile(req, file, cb) {
	delete file.buffer;
	cb(null);
};
