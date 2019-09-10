const mongoose = require('mongoose');

const { MONGODB_HOST, MONGODB_USER, MONGODB_PASS } = process.env;

const dbURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}`;

const connect = function connect(dbName) {
	const options = {
		useNewUrlParser: true,
		useCreateIndex: true,
		dbName,
	};

	mongoose.connect(dbURI, options).then(
		() => {
			// eslint-disable-next-line no-console
			console.log(`Connected to '${mongoose.connection.db.databaseName}'`);
		},
		(err) => {
			// eslint-disable-next-line no-console
			console.log('Error connecting Database instance due to: ', err);
		},
	);
};

module.exports = {
	connect,
	databaseUrl: dbURI,
};
