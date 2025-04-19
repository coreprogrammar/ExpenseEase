const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // For generating reset token
const nodemailer = require("nodemailer");
const transporterPromise = require('../utils/mailer');

class AuthController {
  // ✅ Register User
  async register(req, res) {
    try {
      const { name, email: rawEmail, password } = req.body;
      const email = rawEmail.trim().toLowerCase();
      console.log("🔐 Register attempt ");
      console.log("🔐 Provided password:");
  
      if (!name || !email || !password) {
        console.log("❌ Missing fields");
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      let user = await User.findOne({ email });
      if (user) {
        console.log("❌ User exists:", email);
        return res.status(400).json({ success: false, message: "User already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("🔐 Password hashed:");
  
      user = new User({ name, email, passwordHash: hashedPassword });
      await user.save();
      console.log("✅ New user created:");
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log("🔑 JWT generated:");
  
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: { id: user._id, name: user.name, email }
      });
    } catch (error) {
      console.error("❌ Error in register:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
  
  

  async login(req, res) {
    try {
      const { email: rawEmail, password } = req.body;
      const email = rawEmail.trim().toLowerCase();
      console.log("🔐 Login attempt — email:");
  
      if (!email || !password) {
        console.log("❌ Missing email or password");
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      // 1) Fetch exactly by lowercase email
      const user = await User.findOne({ email });
      console.log("🔎 Fetched user doc:");
  
      if (!user) {
        console.log("❌ No user found with email:", email);
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      // 2) Compare password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      console.log("🔍 Password match:", isMatch);
  
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      // 3) Everything’s good — issue token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log("✅ Login successful — token:");
  
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
  
  // Forgot Password (Generate Reset Token)
async forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.resetToken = resetToken;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset/${resetToken}`;
    const transporter = await transporterPromise;

    const info = await transporter.sendMail({
      from: '"ExpenseEase Support" <support@expenseease.dev>',
      to: email,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    });

    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));

    res.json({
      success: true,
      message: "Password reset email sent.",
      previewURL: nodemailer.getTestMessageUrl(info) // for debugging
    });
  } catch (err) {
    console.error("❌ Error in forgotPassword:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Reset Password
async resetPassword(req, res) {
  try {
    const { token } = req.body;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
}

module.exports = new AuthController();
