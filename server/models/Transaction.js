const mongoose = require('mongoose');

/**
 * Example Transaction schema
 * 
 * Fields:
 * - userId: ref to the 'User' who owns the transaction
 * - date: the date the transaction occurred
 * - description: a text describing the merchant or purpose (e.g., "UBER CANADA/UBERTRIP")
 * - amount: the numerical cost (positive or negative if you handle refunds/credits differently)
 * - category: e.g. "Restaurants", "Transportation", etc.
 * - status: "pending", "approved" (depending on whether user has confirmed it), or "deleted"
 */
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  status: {
    type: String,
    default: 'pending',  // or "approved", etc.
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
