// Core modules
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// User auth
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Setup development environment
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

// Setup database
const db = require('./models/db');

const store = new MongoDBStore({
	uri: db.databaseUrl,
	collection: 'applicationSessions',
});

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Controllers
const userController = require('./controllers/userController');

const app = express();

// Setup user auth
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
	secret: process.env.SESSION_USER_SECRET,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
	},
	store,
	resave: true,
	saveUninitialized: true,
}));

passport.use(new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK_URL,
	},

	((accessToken, refreshToken, profile, done) => {
		userController.findOrCreateUser(profile, (msg) => {
			let user = null;
			if (msg.result && msg.result.length > 0) {
				[user] = msg.result;
			}

			// Update display name
			if (user) {
				// Find user's default account picture
				let profilePicture = null;
				if (profile.photos.length > 0) {
					profilePicture = profile.photos[0].value;
				}

				// Check that user data is up to date from Google account
				if (user.display_name !== profile.displayName
					|| user.display_picture !== profilePicture) {
					// Update user data from Google account data
					user.display_name = profile.displayName;
					user.display_picture = profilePicture;
					userController.updateUser(user.user_id, user, (msgUpdate) => {
						done(msg.error, [user]);
					});
				} else {
					done(msg.error, msg.result);
				}
			} else {
				done(msg.error, msg.result);
			}
		});
	}),
));

passport.serializeUser((user, next) => {
	if (user !== undefined && user[0] !== undefined) {
		next(null, user[0].user_id);
	}
});

passport.deserializeUser((id, next) => {
	userController.findUser(id, (msg) => {
		next(msg.error, msg.result);
	});
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user/loginerror' }),
	(req, res) => {
		res.redirect('/');
	});

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
	// Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
