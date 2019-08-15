const mongoose = require('mongoose');

const { MONGODB_HOST, MONGODB_USER, MONGODB_PASS } = process.env;

const dbURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}`;

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
