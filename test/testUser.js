const mongoose = require('mongoose');
// Testing
const chai = require('chai');
const chaiHttp = require('chai-http');
// Controllers
process.env.NODE_ENV = 'test';
const app = require('../app');
// Models
const User = require('../models/user');

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

after((done) => {
	// Clear database
	User.deleteMany({}, () => {
		mongoose.disconnect((err) => {
			done(err);
			process.exit();
		});
	});
});

describe('User', function describeUser() {
	this.timeout(10000);

	beforeEach((done) => {
		// Clear database
		User.deleteMany({}, (err) => {
			done(err);
		});
	});

	describe('GET /user/search/', () => {
		it('search no users with no query', (done) => {
			chai.request(app)
				.get('/user/search/')
				.end((err, res) => {
					expect(res, 'Should have status code 400').to.have.status(400);
					done();
				});
		});

		it('search no users with query', (done) => {
			const query = 'query';
			chai.request(app)
				.get(`/user/search/${query}`)
				.end((err, res) => {
					expect(res, 'Should have status code 200').to.have.status(200);
					expect(res.body, 'Body should have one result').to.be.empty;
					done(err);
				});
		});

		it('search user with no query', (done) => {
			// Create a new user
			new User({
				user_id: 'user1',
				display_name: 'Test User 1',
			}).save((err, user) => {
				if (err) {
					done(err);
				} else {
					const query = '';
					chai.request(app)
						.get(`/user/search/${query}`)
						.end((errReq, res) => {
							expect(res, 'Should have status code 400').to.have.status(400);
							done(errReq);
						});
				}
			});
		});

		it('search user with matching query', (done) => {
			// Create a new user
			new User({
				user_id: 'user1',
				display_name: 'Test User 1',
			}).save((err, user) => {
				if (err) {
					done(err);
				} else {
					const query = user.display_name;
					chai.request(app)
						.get(`/user/search/${query}`)
						.end((errReq, res) => {
							expect(res, 'Should have status code 200').to.have.status(200);
							expect(res.body, 'Body should have one result').to.have.length(1);
							res.body.forEach((result) => {
								expect(result, 'Result should be an object').to.be.an('object');
								expect(result.display_name, 'Result name should match query').to.equal(query);
							});

							done(errReq);
						});
				}
			});
		});

		it('search user with non-matching query', (done) => {
			// Create a new user
			new User({
				user_id: 'user1',
				display_name: 'Test User 1',
			}).save((err, user) => {
				if (err) {
					done(err);
				} else {
					const query = 'query';
					chai.request(app)
						.get(`/user/search/${query}`)
						.end((errReq, res) => {
							expect(res, 'Should have status code 200').to.have.status(200);
							expect(res.body, 'Body should have one result').to.be.empty;
							done(errReq);
						});
				}
			});
		});
	});
});
