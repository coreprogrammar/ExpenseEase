<!-- README.md -->
<h1 align="center">
  ExpenseEase 💸
</h1>

<p align="center">
  <em>Upload → Parse → Track → Save.</em><br>
  A modern, full‑stack personal‑finance app with automated PDF parsing, smart budgets and interactive data‑viz.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#environment-variables">Env&nbsp;Vars</a> •
  <a href="#api-reference">API</a> •
  <a href="#user-guide">User Guide</a> •
  <a href="#deployment">Deploy</a> •
  <a href="#troubleshooting--faq">FAQ</a>
</p>

---

## Features
|  |  |
|---|---|
| **PDF statement upload** | Drag‑and‑drop bank PDFs → server parses every line, lets you review & edit before saving |
| **Dashboards & Reports** | Animated D3 charts (bar, line, donut, stacked, area, scatter) with tool‑tips, filters & export |
| **Budgets with alerts** | Create weekly / monthly / custom budgets; progress bars & alerts at 80 % usage |
| **Category management** | Add / rename / delete spending categories |
| **Auth & profile** | JWT auth, profile photo upload, edit details, password‑reset via Ethereal |
| **Export** | One‑click CSV export for transactions, print‑ready PDF reports |

Tech Stack 🛠️
• React 18 + Vite 6 + Tailwind CSS 4
• D3 v7   • Framer‑motion   • React Router v7
• Node 18 / Express 5   • MongoDB / Mongoose 7
• Nodemailer (Ethereal demo)


---

## Quick Start

```bash
git clone https://github.com/<you>/ExpenseEase.git
cd ExpenseEase

# install root dependencies (runs workspaces)
npm install

# copy .env templates & fill secrets
cp server/.env.example     server/.env
cp ui-server/.env.example  ui-server/.env

# start both servers
npm run dev      # ↳ UI 5173  •  API 5000


Open http://localhost:5173.

ExpenseEase
├── ui-server/             # React front‑end
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── uploads/               # profile photos & PDF originals (git‑ignored)
├── vercel.json            # monorepo routing (UI + API)
└── README.md


## Environment Variables

<details> <summary><code>server/.env</code></summary>
env

# MongoDB
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/expenseease

# JWT
JWT_SECRET=super-secret-token

# Ethereal (or any SMTP)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=xxxxxxxx
EMAIL_PASS=xxxxxxxx

# Field‑level encryption
DB_CRYPTO_ALGO=aes-256-ctr
DB_CRYPTO_KEY=<64‑hex>
DB_CRYPTO_IV=<32‑hex>

</details> <details> <summary><code>ui-server/.env</code></summary>
VITE_API_BASE=/api       # in production vercel rewrites /api to serverless


