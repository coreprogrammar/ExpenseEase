const Category = require('../models/Category');
const Transaction = require('../models/Transaction'); // for optional rename step

// GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    // We assume you store user’s id in req.user.id from auth middleware
    const categories = await Category.find({ userId: req.user.id }).sort('name');
    return res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    // Create & save
    const category = new Category({
      name,
      userId: req.user.id
    });
    await category.save();

    return res.json({ category });
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // 1) Find & update the category’s name
    const category = await Category.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found or not yours' });
    }

    // 2) (Optional) If your Transaction model stores categories as strings,
    // rename them in existing transactions. For example:
    await Transaction.updateMany(
      {
        userId: req.user.id,
        category: category.name // or oldName if you stored it before this
      },
      { $set: { category: name } }
    );

    return res.json({ category });
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Possibly find the category first
    const category = await Category.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found or not yours' });
    }

    // 2) (Optional) If your transactions store categories as strings, you might
    // remove references or set them to "Uncategorized":
    await Transaction.updateMany(
      {
        userId: req.user.id,
        category: category.name
      },
      { $set: { category: 'Uncategorized' } }
    );

    return res.json({ message: 'Category deleted', category });
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
