// server/routes/exportRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const exportController = require('../controllers/exportController');

router.get('/transactions', auth, exportController.exportTransactions);

module.exports = router;
