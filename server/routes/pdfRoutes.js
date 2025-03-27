// server/routes/pdfRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');
// If you want to protect this route, import auth middleware
const auth = require('../middleware/auth');

// Use memory storage or disk storage
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/pdf/upload
router.post('/upload', auth, upload.single('statement'), pdfController.uploadPdf);

// 2) /api/pdf/finalize – insert after user editing
router.post('/finalize', auth, pdfController.finalizeTransactions);

module.exports = router;
