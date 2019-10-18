const mongoose = require('mongoose');
// Testing
const chai = require('chai');
const chaiHttp = require('chai-http');
// Controllers
process.env.NODE_ENV = 'test';
const passportStub = require('passport-stub');
const app = require('../app');
// Models
const User = require('../models/user');
const Artefact = require('../models/artefact');

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;
passportStub.install(app);

after((done) => {
	// Clear database
	mongoose.disconnect((err) => {
		done(err);
		process.exit();
	});
});

describe('User', function describeUser() {
	this.timeout(60000);
	let authUser = null;

	beforeEach((done) => {
		// Clear database
		Artefact.deleteMany({}, (errArtefact) => {
			if (errArtefact) {
				done(errArtefact);
				return;
			}

			User.deleteMany({}, (errUser) => {
				if (errUser) {
					done(errUser);
					return;
				}

				new User({
					user_id: 1234,
					display_name: 'Test User',
					email: 'test@example.com',
				}).save((err, user) => {
					authUser = user;
					passportStub.login(user);
					done(err);
				});
			});
		});
	});

	afterEach((done) => {
		passportStub.logout();
		done();
	});

	describe('GET /artefact/find/', () => {
		it('check find with no artefacts', (done) => {
			chai.request(app)
				.get(`/artefact/find/${new mongoose.Types.ObjectId(1)}`)
				.redirects(0)
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res, 'Should have status code 500').to.have.status(500);
					expect(res.body).to.be.empty;
					done();
				});
		});

		it('check find with one artefact', (done) => {
			new Artefact({
				name: 'a',
				description: 'b',
				owner: authUser.id,
			}).save((err, artefact) => {
				if (err) {
					done(err);
					return;
				}

				chai.request(app)
					.get(`/artefact/find/${artefact.id}`)
					.redirects(0)
					.end((errFind, res) => {
						expect(errFind, 'Should be no errors').to.not.exist;
						expect(res, 'Should have status code 200').to.have.status(200);
						expect(res.body.name).to.equal('a');
						expect(res.body.description).to.equal('b');
						done();
					});
			});
		});

		it('check find with one artefact with non-matching id', (done) => {
			new Artefact({
				name: 'a',
				description: 'b',
				owner: authUser.id,
			}).save((err, artefact) => {
				if (err) {
					done(err);
					return;
				}

				chai.request(app)
					.get(`/artefact/find/${mongoose.Types.ObjectId(1)}`)
					.redirects(0)
					.end((errFind, res) => {
						expect(errFind, 'Should be no errors').to.not.exist;
						expect(res, 'Should have status code 500').to.have.status(500);
						expect(res.body).to.be.empty;
						done();
					});
			});
		});
	});

	describe('GET /artefact/create/', () => {
		it('create new artefact', (done) => {
			chai.request(app)
				.post('/artefact/create')
				.field('name', 'Test Artefact')
				.field('description', 'Test description.')
				.redirects(1)
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res, 'Should have status code 200').to.have.status(200);
					expect(res, 'Should redirect to /user/').to.redirectTo(/\/user\/$/);
					// Check artefact in user's account
					User.getArtefacts(authUser.id, (errArtefacts, artefacts) => {
						expect(errArtefacts, 'Should be no errors').to.not.exist;

						expect(artefacts).to.exist;
						expect(artefacts.owner).to.exist;
						expect(artefacts.owner.length).to.equal(1);
						expect(artefacts.owner[0].name).to.equal('Test Artefact');
						expect(artefacts.owner[0].description).to.equal('Test description.');

						done();
					});
				});
		});

		it('create artefact with missing fields', (done) => {
			chai.request(app)
				.post('/artefact/create')
				.field('name', 'Test Artefact')
				.redirects(0)
				.end((err, res) => {
					expect(err, 'Should be no errors').to.not.exist;
					expect(res, 'Should have status code 400').to.have.status(400);
					done();
				});
		});
	});

	describe('GET /user/search/', () => {
		it('search no users with no query', (done) => {
			chai.request(app)
				.get('/user/search/')
				.redirects(0)
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
				.redirects(0)
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
					return;
				}

				const query = '';
				chai.request(app)
					.get(`/user/search/${query}`)
					.redirects(0)
					.end((errReq, res) => {
						expect(errReq, 'Should be no errors').to.not.exist;
						expect(res, 'Should have status code 400').to.have.status(400);
						done();
					});
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
					return;
				}

				const query = user.display_name;
				chai.request(app)
					.get(`/user/search/${query}`)
					.redirects(0)
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
					return;
				}

				const query = 'nomatch';
				chai.request(app)
					.get(`/user/search/${query}`)
					.redirects(0)
					.end((errReq, res) => {
						expect(errReq, 'Should be no errors').to.not.exist;
						expect(res, 'Should have status code 200').to.have.status(200);
						expect(res.body, 'Body should have one result').to.be.empty;
						done();
					});
			});
		});
	});
});
