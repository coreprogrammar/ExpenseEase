const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // For generating reset token

class AuthController {
  // ✅ Register User
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ success: false, message: "User already exists" });

      // ✅ Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, passwordHash: hashedPassword });
      await user.save();

      // ✅ Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });

    } catch (error) {
      console.error("❌ Error in register:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  // ✅ Login User
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      // ✅ Compare hashed password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      // ✅ Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });

    } catch (error) {
      console.error("❌ Error in login:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  // ✅ Forgot Password (Generate Reset Token)
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      // ✅ Generate a reset token (valid for 1 hour)
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // ✅ Save reset token in the user document
      user.resetToken = resetToken;
      await user.save();

      res.status(200).json({ success: true, message: "Password reset link sent.", resetToken });

    } catch (error) {
      console.error("❌ Error in forgotPassword:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ✅ Reset Password
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Invalid or expired token." });
      }

      // ✅ Hash new password before saving
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();

      res.status(200).json({ success: true, message: "Password reset successful!" });

    } catch (error) {
      console.error("❌ Error in resetPassword:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }
}

module.exports = new AuthController();
