const mongoose = require('mongoose');

const MONGO_HOST = process.env.MONGODB_HOST;
const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = process.env.MONGODB_PASS;

const dbURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    dbName: 'it_project'
};

mongoose.connect(dbURI, options).then(
    () => {
        console.log('Database connection established!');
    },
    err => {
        console.log('Error connecting Database instance due to: ', err);
    }
);

require('./artefact');
require('./user');

module.exports = {
    databaseUrl: dbURI,
};