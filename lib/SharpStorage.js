const concat = require('concat-stream');
const sharp = require('sharp');

const compressor = sharp()
	.resize({
		width: 1024,
		fit: sharp.fit.contain,
	})
	.jpeg();

function SharpStorage(opts) { }

SharpStorage.prototype._handleFile = function _handleFile(req, file, cb) {
	file.stream.pipe(compressor).pipe(concat({ encoding: 'buffer' }, (data) => {
		cb(null, {
			buffer: data,
			size: data.length,
		});
	}));
};

SharpStorage.prototype._removeFile = function _removeFile(req, file, cb) {
	delete file.buffer;
	cb(null);
};

module.exports = (opts) => new SharpStorage(opts);
