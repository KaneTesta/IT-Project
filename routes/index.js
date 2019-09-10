const express = require('express');
const oauth2 = require('../lib/oauth2');

const router = express.Router();

/* GET home page. */
router.get('/', oauth2.template, (req, res, next) => {
	if (req.isAuthenticated()) {
		res.redirect('/user/');
	} else {
		res.render('index', { title: 'Inherit That' });
	}
});

module.exports = router;
