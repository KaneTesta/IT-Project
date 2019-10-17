// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const createError = require('http-errors');
const express = require('express');

// [START setup]
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MockStrategy = require('passport-mock-strategy').Strategy;
const User = require('../models/user');

const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL,
} = process.env;

function extractProfile(profile) {
	let imageUrl = '';
	let email = '';
	if (profile.photos && profile.photos.length) {
		imageUrl = profile.photos[0].value;
	}
	if (profile.emails && profile.emails.length) {
		email = profile.emails[0].value;
	}
	return {
		id: profile.id,
		displayName: profile.displayName,
		image: imageUrl,
		email,
	};
}

// Configure the Google strategy for use by Passport.js.
//
// OAuth 2-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Google API on the user's behalf,
// along with the user's profile. The function must invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
	new GoogleStrategy(
		{
			name: 'google',
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK_URL,
		},
		(accessToken, refreshToken, profile, cb) => {
			// Extract the minimal profile information we need from the profile object
			// provided by Google
			const googleProfile = extractProfile(profile);
			// eslint-disable-next-line consistent-return
			User.findOne({ user_id: googleProfile.id }, (err, user) => {
				if (err) return cb(err);
				if (!user) {
					user = new User({
						user_id: googleProfile.id,
						display_name: googleProfile.displayName,
						display_picture: googleProfile.image,
						email: googleProfile.email,
					});
					// eslint-disable-next-line arrow-body-style
					user.save((error) => {
						return cb(error, user);
					});
				} else {
					return cb(err, user);
				}
			});
		},
	),
);

if (process.env.NODE_ENV === 'test') {
	passport.use(
		new MockStrategy({
			name: 'mock',
		}, (profile, cb) => {
			const googleProfile = extractProfile(profile);
			const user = new User({
				user_id: googleProfile.id,
				display_name: googleProfile.displayName,
				display_picture: googleProfile.image,
				email: googleProfile.email,
			});
			// eslint-disable-next-line arrow-body-style
			user.save((error) => {
				return cb(error, user);
			});
		}),
	);
}

// Defines how user is set and get from the session
passport.serializeUser((user, cb) => {
	cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
	User.findById(id, (err, user) => {
		cb(err, user);
	});
});
// [END setup]

const router = express.Router();

// [START middleware]
// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired(req, res, next) {
	if (!req.user) {
		req.session.oauth2return = req.originalUrl;
		res.redirect('/auth/login');
		return;
	}

	next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables(req, res, next) {
	res.locals.profile = req.user;
	res.locals.login = `/auth/login?return=${encodeURIComponent(
		req.originalUrl,
	)}`;
	res.locals.logout = `/auth/logout?return=${encodeURIComponent(
		'/',
	)}`;
	next();
}
// [END middleware]

// Begins the authorization flow. The user will be redirected to Google where
// they can authorize the application to have access to their basic profile
// information. Upon approval the user is redirected to `/auth/google/callback`.
// If the `return` query parameter is specified when sending a user to this URL
// then they will be redirected to that URL when the flow is finished.
// [START authorize]
router.get(
	// Login url
	'/auth/login',

	// Save the url of the user's current page so the app can redirect back to
	// it after authorization
	(req, res, next) => {
		if (req.query.return) {
			req.session.oauth2return = req.query.return;
		}
		next();
	},

	// Start OAuth 2 flow using Passport.js
	passport.authenticate('google', { scope: ['email', 'profile'] }),
);
// [END authorize]

// Include mock auth endpoint for testing
if (process.env.NODE_ENV === 'test') {
	router.get(
		// Login url
		'/auth/login/mock',
		// Mock login during test
		passport.authenticate('mock'),
	);
}

// [START callback]
router.get(
	// OAuth 2 callback url. Use this url to configure your OAuth client in the
	// Google Developers console
	'/auth/google/callback',

	// Finish OAuth 2 flow using Passport.js
	passport.authenticate('google'),

	// Redirect back to the original page, if any
	(req, res) => {
		const redirect = req.session.oauth2return || '/';
		delete req.session.oauth2return;
		res.redirect(redirect);
	},
);
// [END callback]

// Deletes the user's credentials and profile from the session.
// This does not revoke any active tokens.
router.get('/auth/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

// Deletes the user's data from the database,
// as well as performing the same actions as logout.
router.get('/auth/delete', authRequired, (req, res, next) => {
	User.deleteOne({ user_id: req.user.user_id }, (err, user) => {
		if (!err) {
			// Perform logout actions for the user
			req.logout();
			res.redirect('/');
		} else {
			// Forward the error
			next(createError(500, err));
		}
	});
});

module.exports = {
	extractProfile,
	router,
	required: authRequired,
	template: addTemplateVariables,
};
