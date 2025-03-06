// server.js
require('dotenv').config(); // Allows usage of .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { authController } = require("./controllers");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authController);

// Simple Test Route
app.get('/', (req, res) => {
  res.send('ExpenseEase API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
