const mongoose = require('mongoose');
// Testing
const chai = require('chai');
const chaiHttp = require('chai-http');
// Controllers
process.env.NODE_ENV = 'test';
const passport = require('passport');
const app = require('../app');
// Models
const User = require('../models/user');
const Artefact = require('../models/artefact');

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

after((done) => {
	// Clear database
	mongoose.disconnect((err) => {
		done(err);
		process.exit();
	});
});

describe('User', function describeUser() {
	this.timeout(60000);

	beforeEach((done) => {
		// Clear database
		User.deleteMany({}, (err) => {
			if (err) {
				done(err);
			} else {
				const provider = 'google';
				const strategy = passport._strategies[provider];

				strategy._token_response = {
					access_token: 'at-1234',
					expires_in: 3600,
				};

				strategy._profile = {
					id: 1234,
					provider,
					displayName: 'Jon Smith',
					email: 'jonsmith@example.com',
				};

				// Auth user
				chai.request(app)
					.get('/auth/login/mock')
					.end((errLogin, res) => {
						done(errLogin);
					});
			}
		});
	});

	describe('GET /artefact/find/', () => {
		it('check find with no artefacts', (done) => {
			chai.request(app)
				.get('/artefact/find/0')
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res.redirects, 'Should be no redirects').to.be.empty;
					expect(res, 'Should have status code 500').to.have.status(500);
					expect(res.body).to.be.empty;
					done();
				});
		});

		it('check find with one artefact', (done) => {
			new Artefact({
				name: 'a',
				description: 'b',
			}).save((err, artefact) => {
				if (err) {
					done(err);
				} else {
					chai.request(app)
						.get(`/artefact/find/${artefact.id}`)
						.end((errFind, res) => {
							expect(errFind, 'Should be no errors').to.not.exist;
							expect(res.redirects, 'Should be no redirects').to.be.empty;
							expect(res, 'Should have status code 200').to.have.status(200);
							expect(res.body.name).to.equal('a');
							expect(res.body.description).to.equal('b');
							done();
						});
				}
			});
		});
	});

	describe('GET /artefact/create/', () => {
		it('create new artefact', (done) => {
			chai.request(app)
				.post('/artefact/create')
				.field('name', 'Artefact')
				.field('description', 'Description')
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res, 'Should have status code 200').to.have.status(200);
					expect('Location', '/user');
					// Check artefact in user's account
					done();
				});
		});
	});

	describe('GET /user/search/', () => {
		it('search no users with no query', (done) => {
			chai.request(app)
				.get('/user/search/')
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res, 'Should have status code 400').to.have.status(400);
					done();
				});
		});

		it('search no users with query', (done) => {
			const query = 'query';
			chai.request(app)
				.get(`/user/search/${query}`)
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res, 'Should have status code 200').to.have.status(200);
					expect(res.body, 'Body should have no results').to.be.empty;
					done();
				});
		});

		it('search user with no query', (done) => {
			// Create a new user
			new User({
				user_id: 'queryuser',
				display_name: 'Query',
			}).save((err, user) => {
				if (err) {
					done(err);
				} else {
					const query = '';
					chai.request(app)
						.get(`/user/search/${query}`)
						.end((errReq, res) => {
							expect(errReq, 'Should be no errors').to.not.exist;
							expect(res, 'Should have status code 400').to.have.status(400);
							done();
						});
				}
			});
		});

		it('search user with matching query', (done) => {
			// Create a new user
			new User({
				user_id: 'queryuser',
				display_name: 'Query',
			}).save((err, user) => {
				if (err) {
					done(err);
				} else {
					const query = user.display_name;
					chai.request(app)
						.get(`/user/search/${query}`)
						.end((errReq, res) => {
							expect(errReq, 'Should be no errors').to.not.exist;
							expect(res, 'Should have status code 200').to.have.status(200);
							expect(res.body, 'Body should have one result').to.have.length(1);
							res.body.forEach((result) => {
								expect(result, 'Result should be an object').to.be.an('object');
								expect(result.display_name, 'Result name should match query').to.equal(query);
							});

							done();
						});
				}
			});
		});

		it('search user with non-matching query', (done) => {
			// Create a new user
			new User({
				user_id: 'queryuser',
				display_name: 'Query',
			}).save((err, user) => {
				if (err) {
					done(err);
				} else {
					const query = 'nomatch';
					chai.request(app)
						.get(`/user/search/${query}`)
						.end((errReq, res) => {
							expect(errReq, 'Should be no errors').to.not.exist;
							expect(res, 'Should have status code 200').to.have.status(200);
							expect(res.body, 'Body should have one result').to.be.empty;
							done();
						});
				}
			});
		});
	});
});
