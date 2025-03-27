const mongoose = require('mongoose');

/**
 * Example budget schema
 * 
 * Fields:
 * - userId => who owns this budget
 * - name => an optional label like "Groceries" or "General monthly"
 * - frequency => "weekly", "monthly", "yearly", or custom
 * - amount => how much the user can spend in this budget period
 * - categories => array of strings or references to Category model (e.g. "Restaurants", "Transportation")
 * - startDate, endDate => optional date range if the budget is time-bound
 */
const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly', 'custom'],
    default: 'monthly',
  },
  amount: {
    type: Number,
    required: true,
  },
  categories: [{
    type: String, // or type: mongoose.Schema.Types.ObjectId if referencing Category
    default: [],  
  }],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
