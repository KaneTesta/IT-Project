// Core modules
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const logger = require('morgan');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// Setup development environment
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

// Setup database
const db = require('./models/db');

if (process.env.NODE_ENV === 'production') {
	db.connect('it_project_prod');
} else if (process.env.NODE_ENV === 'test') {
	db.connect('it_project_test');
} else {
	app.use(logger('dev'));
	db.connect('it_project');
}

// Configure session
const sessionConfig = {
	secret: process.env.SESSION_USER_SECRET,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
	},
	resave: true,
	saveUninitialized: true,
	store: new MongoDBStore({
		uri: db.databaseUrl,
		collection: 'applicationSessions',
	}),
};

app.use(session(sessionConfig));

// Routers

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const artefactRouter = require('./routes/artefact');

app.use(passport.initialize());
app.use(passport.session());


// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_USER_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// OAuth2
const oauth2 = require('./lib/oauth2');

app.use(oauth2.router);

// Mount routes
app.use('/', oauth2.template); // Include res.locals
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/artefact', artefactRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404, 'Page not found'));
});

// Error handler
app.use((err, req, res, next) => {
	const env = req.app.get('env');
	// Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = (env === 'development' || env === 'test') ? err : {};

	// Render the error page
	res.status(err.status || 500);
	res.render('error', { title: 'Error', user: req.user });
});


module.exports = app;
