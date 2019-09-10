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

	let user = null;
	beforeEach((done) => {
		// Clear database
		User.deleteMany({}, () => {
			// Create a new user
			const newUser = new User({
				user_id: 'user1',
				display_name: 'Test User 1',
			});

			newUser.save((err, savedUser) => {
				user = savedUser;
				done(err);
			});
		});
	});

	describe('GET /user/search/', () => {
		it('search user with no query', (done) => {
			chai.request(app)
				.get('/user/search/')
				.end((err, res) => {
					expect(res, 'Should have status code 400').to.have.status(400);
					done();
				});
		});

		it('search user with matching query', (done) => {
			const query = user.display_name;
			chai.request(app)
				.get(`/user/search/${query}`)
				.end((err, res) => {
					expect(res, 'Should have status code 200').to.have.status(200);
					done();
				});
		});
	});
});
