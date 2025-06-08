# Laborer Tracking System (نظام تتبع العامل)

A simple bilingual (Arabic-first) web application built with **React** and **Convex** that helps laborers track their workdays, earnings, expenses, and remaining balances.

## 🌟 Features

- ✅ Add daily work entries (with automatic or manual date input)
- ✅ Display **both Gregorian and Hijri** dates
- ✅ Auto-calculate total earnings based on days worked
- ✅ Add and manage expenses (advance payments, deductions)
- ✅ Show current balance (total earnings - total expenses)
- ✅ "Clear Account" button that archives all current data instead of deleting
- ✅ Ability to view or restore archived records
- ✅ Simple, mobile-friendly UI fully in Arabic

## 📦 Tech Stack

- **Frontend**: React (with Arabic UI)
- **Backend**: Convex
- **Hijri Date Conversion**: `@ajmedu/hijri-date` or similar libraries

## 🗃️ Database Structure (Convex)

### Table: `workdays`

| Field        | Type      | Description              |
| ------------ | --------- | ------------------------ |
| `id`         | String    | Document ID (Convex)     |
| `date`       | String    | Workday date (Gregorian) |
| `dayRate`    | Number    | Daily wage               |
| `_createdAt` | Timestamp | Auto timestamp           |

### Table: `expenses`

| Field         | Type      | Description            |
| ------------- | --------- | ---------------------- |
| `id`          | String    | Document ID (Convex)   |
| `amount`      | Number    | Expense or amount paid |
| `description` | String    | Description or note    |
| `date`        | String    | Date of expense        |
| `type`        | String    | Type (e.g., "expense") |
| `_createdAt`  | Timestamp | Auto timestamp         |

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Convex account (https://www.convex.dev)
- Arabic font support (e.g., Google Fonts)

### Installation

```bash
git clone https://github.com/H0ssamAhmed/laborer-tracking-system.git

cd laborer-tracking-system

npm install
```

## After Installation is Done

To start the application locally, open **two terminals**:

1. In the **first terminal**, run the React frontend:
   ```bash
   npm run dev
   ```
2. In the **seoncd terminal**, run the Convex backend:
   ```bash
   npm convex dev
   ```

#

Now open your browser on `http://localhost:8080` and enjoy
