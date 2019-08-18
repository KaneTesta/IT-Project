const createError = require('http-errors');
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
	userController.getUser(req, (user) => {
		if (user) {
			res.render('user/dashboard', { title: 'Inherit That', user });
		} else {
			res.render('index', { title: 'Inherit That', user });
		}
	});
});

/* GET page for item page. */
router.get('/page/:id', (req, res, next) => {
	userController.getUser(req, (user) => {
		if (user && user.pages) {
			const page = user.pages.find((el) => el.page_id.toString() === req.params.id.toString());

			if (page) {
				res.render('user/page', { title: 'Error', user, page });
			} else {
				next(createError(403, "You don't have permission to access this page"));
			}
		} else {
			res.redirect('/');
		}
	});
});

module.exports = router;
