const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.get('/', auth, reportController.getReportData);

module.exports = router;
