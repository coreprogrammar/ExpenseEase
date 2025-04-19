const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash -passwordSalt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Ensure full URL is sent even if old data is stored in MongoDB
    const profileImageUrl = user.profileImage.startsWith("/uploads/")
      ? `https://expenseease-backend-e786293136db.herokuapp.com${user.profileImage}`
      : user.profileImage;

    res.status(200).json({ 
      success: true, 
      user: {
        name: user.name,
        email: user.email,
        profileImage: profileImageUrl,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateUserProfile = async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
  
      res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ success: false, message: "Error updating profile" });
    }
  };


  exports.uploadProfilePhoto = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // ✅ Store full URL in database
      const fullImageUrl = `https://expenseease-backend-e786293136db.herokuapp.com/uploads/${req.file.filename}`;
      console.log("✅ Uploaded Image Path:", fullImageUrl); // Debugging
  
      user.profileImage = fullImageUrl;
      await user.save();
  
      res.status(200).json({ 
        success: true, 
        message: "Profile photo updated", 
        profileImage: fullImageUrl
      });
    } catch (error) {
      console.error("❌ Error uploading photo:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
