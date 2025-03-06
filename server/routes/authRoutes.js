const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// ✅ Register and return JWT
router.post("/register", authController.register);

// ✅ Login and return JWT
router.post("/login", authController.login);

module.exports = router;
