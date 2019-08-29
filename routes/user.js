const express = require('express');

const router = express.Router();
const oauth2 = require('../lib/oauth2');
const userController = require('../controllers/userController');

router.get('/', oauth2.required, userController.getUserDashboard);

module.exports = router;
