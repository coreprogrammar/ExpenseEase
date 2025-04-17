const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const alertController = require('./alertController');

// 1) GET all transactions for the current user
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    // Optionally, sort by date descending
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 2) CREATE a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, description, amount, category, status } = req.body;

    if (!date || !amount) {
      return res.status(400).json({ error: 'Date and amount are required' });
    }

    const transaction = new Transaction({
      userId,
      date: new Date(date),
      description: description || '',
      amount,
      category: category || 'Uncategorized',
      status: status || 'pending'
    });

    await transaction.save();

    // ✅ Check for alerts after saving the transaction
    await alertController.checkUserAlerts(userId);

    res.json(transaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 3) UPDATE an existing transaction
exports.updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { date, description, amount, category, status } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(date && { date: new Date(date) }),
        ...(description !== undefined && { description }),
        ...(amount !== undefined && { amount }),
        ...(category !== undefined && { category }),
        ...(status !== undefined && { status })
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not yours' });
    }

    // ✅ Recheck alerts after transaction update
    await alertController.checkUserAlerts(userId);

    res.json(transaction);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// 4) DELETE a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not yours' });
    }

    // ✅ Recheck alerts after transaction deletion
    await alertController.checkUserAlerts(userId);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getSummary = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Monthly overview aggregation
      const monthlyOverview = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: { month: { $month: "$date" }, year: { $year: "$date" } },
            totalSpent: { $sum: "$amount" }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
  
      // Transform monthlyOverview to desired format
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const formattedMonthly = monthlyOverview.map(item => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        totalSpent: item.totalSpent
      }));
  
      // Top spending categories aggregation
      const topCategories = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$category", amount: { $sum: "$amount" } } },
        { $sort: { amount: -1 } },
        { $limit: 5 }
      ]).then(results =>
        results.map(item => ({ category: item._id, amount: item.amount }))
      );
  
      // Get total spent this month (for simplicity, using all transactions)
      const totalSpentMonth = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).then(results => (results[0] ? results[0].total : 0));
  
      // Assume total income, budgetSummary, budgetUsedPercent are computed or stored elsewhere
      // For demo purposes, we use static values:
      const totalIncome = 3000;
      const budgetSummary = "You've used 40% of your monthly budget.";
      const budgetUsedPercent = 40;
  
      // Get recent transactions (e.g. last 5)
      const recentTransactions = await Transaction.find({ userId })
        .sort({ date: -1 })
        .limit(10);
        console.log("📊 Raw Monthly Overview:", monthlyOverview);
console.log("📊 Formatted Monthly Overview:", formattedMonthly);

      res.json({
        monthlyOverview: formattedMonthly,
        topCategories,
        totalSpentMonth,
        totalIncome,
        budgetSummary,
        budgetUsedPercent,
        recentTransactions
      });
    } catch (err) {
      console.error('Error in getSummary:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  


exports.getRecentTransactions = async (req, res) => {
    try {
      const userId = req.user.id;
      // e.g. last 5 or 10 transactions, sorted by date desc
      const transactions = await Transaction.find({ userId })
        .sort({ date: -1 })
        .limit(5);
  
      res.json({ transactions });
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  exports.searchTransactions = async (req, res) => {
    try {
      const userId = req.user.id; // from auth middleware
      const { query, category, startDate, endDate } = req.query;
      const filter = { userId };
  
      // If a search query is provided, search in description and category
      if (query) {
        filter.$or = [
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ];
      }
      // Filter by specific category
      if (category) {
        filter.category = category;
      }
      // Filter by date range
      if (startDate) {
        filter.date = { ...filter.date, $gte: new Date(startDate) };
      }
      if (endDate) {
        filter.date = { ...filter.date, $lte: new Date(endDate) };
      }
  
      const transactions = await Transaction.find(filter).sort({ date: -1 });
      res.json(transactions);
    } catch (err) {
      console.error('Error searching transactions:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };