const Alert = require('../models/Alert');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

/**
 * Minimal routine to check each budget for a user.
 * For each budget, if spending exceeds a threshold (e.g. 80%),
 * and no active alert exists for that budget, create one.
 */
async function checkUserAlerts(userId) {
  // Get all budgets for the user
  const budgets = await Budget.find({ userId });
  
  // For each budget, compute total spending (optionally restrict by date range)
  for (const budget of budgets) {
    const matchQuery = { userId: new mongoose.Types.ObjectId(userId) };
    if (budget.categories && budget.categories.length > 0) {
      matchQuery.category = { $in: budget.categories };
    }
    if (budget.startDate) {
      matchQuery.date = { ...matchQuery.date, $gte: budget.startDate };
    }
    if (budget.endDate) {
      matchQuery.date = { ...matchQuery.date, $lte: budget.endDate };
    }
    
    const aggResult = await Transaction.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
    ]);
    
    const totalSpent = aggResult.length > 0 ? aggResult[0].totalSpent : 0;
    const usagePercent = (budget.amount > 0) ? (totalSpent / budget.amount) * 100 : 0;
    
    // If usage exceeds 80% and no active alert for this budget exists, create one.
    if (usagePercent >= 80) {
      const existingAlert = await Alert.findOne({
        userId,
        message: { $regex: budget.name, $options: 'i' },
        dismissed: false
      });
      if (!existingAlert) {
        const message = `You’re nearing your ${budget.name} budget!`;
        await Alert.create({ userId, message });
      }
    }
  }
}

// Endpoint to get alerts for the user
exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = await Alert.find({ userId, dismissed: false }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching alerts' });
  }
};

// Endpoint to dismiss a specific alert
exports.dismissAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    await Alert.findByIdAndUpdate(alertId, { dismissed: true });
    res.json({ message: 'Alert dismissed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not dismiss alert' });
  }
};

// Expose the check routine so it can be called after transactions update
exports.checkUserAlerts = checkUserAlerts;
