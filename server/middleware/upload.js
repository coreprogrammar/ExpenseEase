const multer = require("multer");
const path = require("path");

// ✅ Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname)); // Rename file with user ID
  },
});

// ✅ File Filter (Accept only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb("Error: Only images are allowed!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB
});

module.exports = upload;
