const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // ✅ Check if user is authenticated via session
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);

      if (!user) {
        return res.status(401).json({ success: false, error: "User not found" });
      }

      req.user = user; // Attach user object to request
      return next();
    }

    return res.status(401).json({ success: false, error: "User is not authenticated" });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error during authentication" });
  }
};
