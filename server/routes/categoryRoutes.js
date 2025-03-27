const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// GET all categories for the current user
router.get('/', auth, categoryController.getAllCategories);

// Create a new category
router.post('/', auth, categoryController.createCategory);

// Rename/update a category
router.put('/:id', auth, categoryController.updateCategory);

// Delete a category
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
