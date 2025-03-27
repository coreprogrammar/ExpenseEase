// server/controllers/exportController.js
const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');

exports.exportTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch all transactions for this user
    const transactions = await Transaction.find({ userId });
    
    // Define fields to export (adjust field names as needed)
    const fields = ['date', 'description', 'amount', 'category', 'status'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(transactions);

    // Set headers to trigger file download
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error exporting transactions' });
  }
};
