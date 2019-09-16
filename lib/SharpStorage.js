const concat = require('concat-stream');
const sharp = require('sharp');

/**
 * Converts file to JPEG of width >= 1024px.
 * Saves to buffer
 * @param {Object} req - Express request object
 * @param {Object} file - File
 * @param {function} cb - Callback function
 */
module.exports._handleFile = function _handleFile(req, file, cb) {
	// Only compress images
	if (file.mimetype.match(/image.*/)) {
		const compressor = sharp()
			.resize({
				width: 1024,
				fit: sharp.fit.contain,
			})
			.jpeg();

		// Change filetype to jpeg
		file.mimetype = 'image/jpeg';
		file.originalname = `${Date.now()}-${file.originalname}.jpg`;

		file.stream.pipe(compressor).pipe(concat({ encoding: 'buffer' }, (data) => {
			cb(null, {
				buffer: data,
				size: data.length,
			});
		}));
	} else {
		// TODO remove code duplication
		// Set a unique filename
		file.originalname = Date.now() + file.originalname;
		file.stream.pipe(concat({ encoding: 'buffer' }, (data) => {
			cb(null, {
				buffer: data,
				size: data.length,
			});
		}));
	}
};

// Deletes file from buffer
module.exports._removeFile = function _removeFile(req, file, cb) {
	delete file.buffer;
	cb(null);
};
