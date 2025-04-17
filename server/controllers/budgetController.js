const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// GET all budgets for the current user
exports.getAllBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, frequency, amount, categories, startDate, endDate } = req.body;

    // Basic checks
    if (!name || !amount) {
      return res.status(400).json({ error: 'Name and amount are required' });
    }

    const budget = new Budget({
      userId,
      name,
      frequency: frequency || 'monthly',
      amount,
      categories: categories || [],
      startDate,
      endDate
    });
    await budget.save();

    res.json(budget);
  } catch (err) {
    console.error('Error creating budget:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an existing budget
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // budget _id
    const { name, frequency, amount, categories, startDate, endDate } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { name, frequency, amount, categories, startDate, endDate },
      { new: true }
    );
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found or not yours' });
    }
    res.json(budget);
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found or not yours' });
    }
    res.json({ message: 'Budget deleted', budget });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET usage data for budgets
exports.getBudgetsUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1) Fetch all active budgets for user
    const budgets = await Budget.find({ userId });

    // We'll build an array of usage results
    const budgetsUsage = [];

    for (const budget of budgets) {
      // 2) Build a $match query for relevant transactions
      const matchQuery = { userId: new mongoose.Types.ObjectId(userId) };

      // if categories array is non-empty, we only match those categories
      if (budget.categories && budget.categories.length > 0) {
        matchQuery.category = { $in: budget.categories };
      }

      // If there's a start/end date, match those as well
      if (budget.startDate) {
        matchQuery.date = { ...matchQuery.date, $gte: budget.startDate };
      }
      if (budget.endDate) {
        matchQuery.date = { ...matchQuery.date, $lte: budget.endDate };
      }

      // e.g. if frequency is 'monthly', you might do logic to interpret the current month's range, etc.
      // For simplicity, we'll assume start/end covers it.

      const aggregateResult = await Transaction.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$amount' }
          }
        }
      ]);

      const totalSpent = aggregateResult.length > 0 ? aggregateResult[0].totalSpent : 0;
      const usedPercent = budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0;

      budgetsUsage.push({
        _id: budget._id,
        name: budget.name,
        frequency: budget.frequency,
        amount: budget.amount,
        categories: budget.categories,
        startDate: budget.startDate,
        endDate: budget.endDate,
        totalSpent,
        usedPercent: usedPercent.toFixed(2),
      });
    }

    res.json({ budgetsUsage });
  } catch (err) {
    console.error('Error getting budgets usage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Recalculate actual spent for all budgets based on current transactions
exports.recalculateSpent = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ userId });

    for (const budget of budgets) {
      const matchQuery = { userId };

      if (budget.categories.length > 0) {
        matchQuery.category = { $in: budget.categories };
      }
      if (budget.startDate) {
        matchQuery.date = { ...matchQuery.date, $gte: budget.startDate };
      }
      if (budget.endDate) {
        matchQuery.date = { ...matchQuery.date, $lte: budget.endDate };
      }

      const agg = await Transaction.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      const totalSpent = agg.length > 0 ? agg[0].total : 0;
      budget.spent = totalSpent;
      await budget.save();
    }

    res.json({ message: "Recalculated budget spending." });
  } catch (err) {
    console.error("Error recalculating spent:", err);
    res.status(500).json({ error: "Could not recalculate spent." });
  }
};


