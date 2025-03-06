const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ success: false, message: "User already exists" });

      // ✅ Save the password correctly in `passwordHash`
      user = new User({ name, email, passwordHash: password });
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

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

      // ✅ Compare the password with `passwordHash`
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
}

module.exports = new AuthController();
