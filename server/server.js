require('dotenv').config(); // Allows usage of .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('./logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expenseease';
mongoose.connect(MONGO_URI, {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Simple Test Route
app.get('/', (req, res) => {
  res.send('ExpenseEase API is running!');
  winston.info('Home Route Accessed'); // Logging with Winston
    res.send('Hello, World!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  winston.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});
// Start Server
app.listen(PORT, () => {
  winston.info("Server running on http://localhost:${PORT}");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server listening on port ${PORT}");
});