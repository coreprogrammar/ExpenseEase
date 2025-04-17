const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getReportData = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId });

    // Monthly Overview
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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyOverview.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      totalSpent: item.totalSpent
    }));

    // Daily Trends
    const dailyTrends = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSpent: { $sum: "$amount" }
        }
      },
      {
        $project: {
          date: "$_id",
          totalSpent: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Category Distribution
    const categoryDistribution = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          category: "$_id",
          amount: 1,
          _id: 0
        }
      },
      { $sort: { amount: -1 } }
    ]);

    // ✅ Stacked Bar Chart (Group by date and category)
    const stackedDataAggregation = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          categoryAmounts: {
            $push: { k: "$_id.category", v: "$total" }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          categories: {
            $arrayToObject: "$categoryAmounts"
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ date: "$date" }, "$categories"]
          }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // ✅ Extract unique keys from stacked data
    const stackKeysSet = new Set();
    stackedDataAggregation.forEach(row => {
      Object.keys(row).forEach(k => {
        if (k !== "date") stackKeysSet.add(k);
      });
    });

    const stackKeys = [...stackKeysSet];

    // Response
    res.json({
      dailyTrends,
      monthlyOverview: formattedMonthly,
      categoryDistribution,
      stackedData: stackedDataAggregation,
      stackKeys
    });

  } catch (err) {
    console.error("Error in getReportData:", err);
    res.status(500).json({ error: "Failed to fetch report data." });
  }
};
