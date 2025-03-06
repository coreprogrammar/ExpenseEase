const Transaction = require("../models/Transaction");

// Fetch the dashboard summary for an authenticated user
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated request

    // Fetch user's transactions
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    // Calculate total income & expenses
    const totalIncome = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalSpentMonth = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Budget summary message
    const budgetSummary = totalSpentMonth > totalIncome
      ? "You're over budget!"
      : "You're within budget.";

    res.status(200).json({
      totalSpentMonth,
      totalIncome,
      budgetSummary,
      recentTransactions: transactions.slice(0, 5), // Only return the latest 5 transactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while fetching dashboard data" });
  }
};
