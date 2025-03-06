const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const auth = require("../middleware/auth"); // Middleware for authentication

// GET /api/dashboard - Fetch user's financial summary
router.get("/", auth, getDashboardData);

module.exports = router;
