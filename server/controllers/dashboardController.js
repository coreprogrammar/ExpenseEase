const Transaction = require("../models/Transaction");

class DashboardController {
  async getDashboardData(req, res) {
    try {
      const userId = req.user.id; // ✅ Get user ID from JWT

      // ✅ Fetch user's transactions from DB
      const transactions = await Transaction.find({ userId }).sort({ date: -1 });

      // ✅ Calculate total income & expenses
      const totalIncome = transactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalSpentMonth = transactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

      // ✅ Budget summary message
      const budgetSummary = totalSpentMonth > totalIncome
        ? "You're over budget!"
        : "You're within budget.";

      return res.status(200).json({
        success: true,
        totalSpentMonth,
        totalIncome,
        budgetSummary,
        recentTransactions: transactions.slice(0, 5), // ✅ Only return the latest 5 transactions
      });

    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      return res.status(500).json({ success: false, error: "Server error while fetching dashboard data" });
    }
  }
}

module.exports = new DashboardController();
