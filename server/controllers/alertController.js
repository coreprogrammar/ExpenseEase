const Alert = require('../models/Alert');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

async function checkUserAlerts(userId) {
  try {
    const budgets = await Budget.find({ userId });

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

      // 💡 Alert trigger condition
      if (usagePercent >= 80) {
        const existingAlert = await Alert.findOne({
          userId,
          message: { $regex: budget.name, $options: 'i' },
          dismissed: false
        });

        if (!existingAlert) {
          const message = `You’re nearing your ${budget.name} budget! You've used ${usagePercent.toFixed(1)}%`;
          await Alert.create({ userId, message });
        }
      }
    }
  } catch (err) {
    console.error('❌ Error checking user alerts:', err);
  }
}

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

exports.checkUserAlerts = checkUserAlerts;
