const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

router.get('/', auth, transactionController.getAllTransactions);
router.post('/', auth, transactionController.createTransaction);
router.put('/:id', auth, transactionController.updateTransaction);
router.delete('/:id', auth, transactionController.deleteTransaction);

// ADD THIS for recent:
router.get('/recent', auth, transactionController.getRecentTransactions);

router.get('/summary', auth, transactionController.getSummary);

// Search endpoint (only returns transactions for the authenticated user)
router.get('/search', auth, transactionController.searchTransactions);

module.exports = router;
