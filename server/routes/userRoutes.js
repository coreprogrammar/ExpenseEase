const express = require("express");
const { getUserProfile, updateUserProfile, uploadProfilePhoto } = require("../controllers/userController");
const auth = require("../middleware/auth"); // ✅ Protect route with JWT
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile); // ✅ Allow updating profile
router.post("/upload-photo", auth, upload.single("profileImage"), uploadProfilePhoto);

module.exports = router;
