# ExpenseEase 💸

A full‑stack **personal‑finance web‑app** that lets users

* upload PDF bank statements and auto‑parse transactions  
* manage categories and budgets with smart usage alerts  
* view interactive reports (bar, line, pie, scatter, stacked, area)  
* receive password‑reset emails via Ethereal (or any SMTP)  
* export CSV and print reports

Built with **React + Vite + Tailwind CSS** in `ui-server/` and
**Node/Express + MongoDB** in `server/`.

---

## Table of Contents

1. [Quick Start](#quick-start)  
2. [Monorepo Layout](#monorepo-layout)  
3. [Environment Variables](#environment-variables)  
4. [Development Scripts](#development-scripts)  
5. [REST API Reference](#rest-api-reference)  
6. [User Guide](#user-guide)  
7. [Troubleshooting & FAQ](#troubleshooting--faq)  
8. [Deployment (Vercel + Render)](#deployment)  
9. [Contributing](#contributing)  
10. [License](#license)

---

## Quick Start

```bash
# 1 clone + install both workspaces
git clone https://github.com/<you>/ExpenseEase.git
cd ExpenseEase

# 2 copy env templates (see below) and fill secrets
cp server/.env.example server/.env
cp ui-server/.env.example ui-server/.env

# 3 run everything
npm run dev       # ↳ concurrently runs ui (5173) + API (5000)
