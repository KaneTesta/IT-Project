const express = require('express');
const router = express.Router();
const userController = require('../controllers/printController');
router.get('/', userController.getPrintDashboard);

module.exports = router;