const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const alertController = require('../controllers/alertController');

router.get('/', auth, alertController.getAlerts);
router.put('/:alertId/dismiss', auth, alertController.dismissAlert);

module.exports = router;
