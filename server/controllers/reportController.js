const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getReportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, category } = req.query;
    
    const filter = { userId: new mongoose.Types.ObjectId(userId) };
    if (startDate) filter.date = { ...filter.date, $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
    if (category) filter.category = category;
    
    // Daily trends: group transactions by date
    const dailyTrendsAgg = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSpent: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    const dailyTrends = dailyTrendsAgg.map(item => ({
      date: item._id,
      totalSpent: item.totalSpent
    }));
    
    // Category distribution: group transactions by category
    const categoryAgg = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { amount: -1 } }
    ]);
    const categoryDistribution = categoryAgg.map(item => ({
      category: item._id,
      amount: item.amount
    }));
    
    res.json({ dailyTrends, categoryDistribution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error generating report data' });
  }
};
