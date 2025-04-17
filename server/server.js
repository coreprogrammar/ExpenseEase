// server.js
require("dotenv").config();
const express   = require("express");
const path      = require("path");
const mongoose  = require("mongoose");
const cors      = require("cors");

const pdfRoutes        = require('./routes/pdfRoutes');
const categoryRoutes    = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes      = require('./routes/budgetRoutes');
const alertRoutes       = require('./routes/alertRoutes');
const reportRoutes      = require('./routes/reportRoutes');
const exportRoutes      = require('./routes/exportRoutes');

const app = express();

/* ---------- middleware ---------- */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- Mongo connection (cached for lambdas) ---------- */
const mongoConnect = async () => {
  if (mongoose.connection.readyState === 1) return;   // already connected
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB connected");
};

/* ---------- routes ---------- */
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/dashboard",   require("./routes/dashboardRoutes"));
app.use("/api/users",       require("./routes/userRoutes"));
app.use("/api/pdf",         pdfRoutes);
app.use("/api/categories",  categoryRoutes);
app.use("/api/transactions",transactionRoutes);
app.use("/api/budgets",     budgetRoutes);
app.use("/api/alerts",      alertRoutes);
app.use("/api/reports",     reportRoutes);
app.use("/api/export",      exportRoutes);

/* ---------- error handler ---------- */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

/* ------------------------------------------------------------------
   🚀  LOCAL DEV: still listen on port 5000
   ------------------------------------------------------------------ */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  mongoConnect().then(() => {
    app.listen(PORT, () => console.log(`🖥️  API listening on ${PORT}`));
  });
}

/* ------------------------------------------------------------------
   🚀  SERVERLESS (Vercel): export a handler
   ------------------------------------------------------------------ */
module.exports = async (req, res) => {
  await mongoConnect();   // ensure DB is ready each cold start
  return app(req, res);   // proxy the request to Express
};
