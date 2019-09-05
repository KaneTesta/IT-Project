const concat = require('concat-stream');
const sharp = require('sharp');

const compressor = sharp()
	.resize({
		width: 1024,
		fit: sharp.fit.contain,
	})
	.jpeg();

module.exports._handleFile = function (req, file, cb) {
	file.stream.pipe(compressor).pipe(concat({ encoding: 'buffer' }, (data) => {
		cb(null, {
			buffer: data,
			size: data.length,
		});
	}));
};

module.exports._removeFile = function (req, file, cb) {
	delete file.buffer;
	cb(null);
};
