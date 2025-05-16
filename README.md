# Laborer Tracking System (نظام تتبع العامل)

A simple bilingual (Arabic-first) web application built with **React** and **Supabase** that helps laborers track their workdays, earnings, expenses, and remaining balances.

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
- **Backend & Auth**: Supabase
- **Date Conversion**: Hijri date conversion using `@ajmedu/hijri-date` or similar libraries

## 🗃️ Database Structure (Supabase)

### Table: `workdays`

| Field        | Type      | Description                |
| ------------ | --------- | -------------------------- |
| `id`         | UUID      | Primary key                |
| `user_id`    | UUID      | Supabase Auth user ID      |
| `date`       | Date      | Workday date (Gregorian)   |
| `archived`   | Boolean   | Marks if entry is archived |
| `created_at` | Timestamp | Auto timestamp             |

### Table: `expenses`

| Field        | Type      | Description                |
| ------------ | --------- | -------------------------- |
| `id`         | UUID      | Primary key                |
| `amount`     | Numeric   | Expense or amount paid     |
| `note`       | Text      | Description or note        |
| `date`       | Date      | Date of expense            |
| `archived`   | Boolean   | Marks if entry is archived |
| `created_at` | Timestamp | Auto timestamp             |

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Supabase account
- Arabic font support (e.g., Google Fonts)

### Installation

```bash
git clone https://github.com/H0ssamAhmed/laborer-tracking-system.git

cd laborer-tracking-system

npm install
```
