const mongoose = require('mongoose');

const { MONGO_HOST, MONGO_USER, MONGO_PASS } = process.env;

const dbURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  dbName: 'it_project',
};

mongoose.connect(dbURI, options).then(
  () => {
    // eslint-disable-next-line no-console
    console.log('Database connection established!');
  },
  (err) => {
    // eslint-disable-next-line no-console
    console.log('Error connecting Database instance due to: ', err);
  },
);

require('./artefact');
require('./user');

module.exports = {
  databaseUrl: dbURI,
};
