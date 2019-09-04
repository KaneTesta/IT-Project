const createError = require('http-errors');

// Convert errors products by express-validator into a human-readable format,
// where each new error is on a new line.
exports.errorsToMessage = function errorsToMessage(errors) {
	return errors.array().map((e) => e.msg).join('\n');
};

// Create a 500 http error from a valition error produced by express-validator.
exports.createValidationError = function createValidationError(errors) {
	return createError(500, exports.errorsToMessage(errors));
};
