const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUserDashboard);

router.get('/search/', userController.searchUsers);
router.get('/search/:query', userController.searchUsers);

module.exports = router;
