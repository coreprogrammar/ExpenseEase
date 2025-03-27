const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const budgetController = require('../controllers/budgetController');

// GET all budgets
router.get('/', auth, budgetController.getAllBudgets);

// CREATE a budget
router.post('/', auth, budgetController.createBudget);

// UPDATE a budget
router.put('/:id', auth, budgetController.updateBudget);

// DELETE a budget
router.delete('/:id', auth, budgetController.deleteBudget);

// GET usage data for all budgets
router.get('/usage', auth, budgetController.getBudgetsUsage);

module.exports = router;
