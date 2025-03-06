const express = require("express");
const router = express.Router();
const { dashboardController } = require("../controllers");
const authMiddleware = require("../middleware/auth"); // ✅ Session-based authentication

// ✅ GET /api/dashboard - Fetch user's financial summary (Protected Route)
router.get("/", authMiddleware, dashboardController.getDashboardData);

module.exports = router;
