# 📚 SmartLib: Next-Gen Library Management System

![SmartLib Banner](https://img.shields.io/badge/SmartLib-JNTUGV-indigo?style=for-the-badge&logo=library)
![Version](https://img.shields.io/badge/Version-1.0.0-emerald?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production--Ready-blue?style=for-the-badge)

**SmartLib** is a high-performance, mobile-responsive library management portal designed specifically for the **Jawaharlal Nehru Technological University Gurajada Vizianagaram (JNTUGV)**. Built with the MERN stack, it streamlines book discovery, automated overdue tracking, and secure student-librarian interactions.

---

## ✨ Core Features

### 🎓 For Students
- **Smart Dashboard**: A clean overview of your latest 5 borrowed books and active fines.
- **Global Catalog**: Browse the entire library collection with real-time availability status.
- **Instant Reservations**: Reserve books directly from your mobile or laptop.
- **Fine Ledger**: Transparent tracking of late fees and payment history.
- **Live Notifications**: Automated alerts for upcoming due dates and overdue books.

### 🔐 For Librarians (Admin)
- **Asset Control**: Effortlessly issue, return, and renew books via a centralized console.
- **User Management**: Add and manage student records with roll-number-based tracking.
- **Overdue Monitoring**: Real-time tracking of all late returns across the campus.
- **Automated Cron Jobs**: Background systems that calculate fines and send email alerts every minute.
- **Analytics Hub**: Daily stats on active borrows, overdue counts, and total assets.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Authentication**: JWT (JSON Web Tokens) with secure `sessionStorage` persistence.
- **Utilities**: Axios, Node-Cron, Nodemailer (Email integration).

---

## 📂 Project Structure

```text
SmartLib/
├── backend/
│   ├── config/          # Database & Email configurations
│   ├── controllers/     # Core business logic (Admin & Book logic)
│   ├── models/          # MongoDB Schemas (User, Book, Issue, etc.)
│   ├── routes/          # Express API endpoints
│   ├── middleware/      # Auth & Admin security filters
│   └── index.js         # Entry point & Cron job initialization
└── frontend/
    ├── src/
    │   ├── api/         # Axios service layer
    │   ├── components/  # Reusable UI parts (Tables, Nav, Layouts)
    │   ├── context/     # Auth & UI State management
    │   ├── hooks/       # Custom React logic (useBooks, useFines)
    │   └── pages/       # Main views (Home, Dashboard, Login)
    └── public/          # Static assets & Logos
```

---

## 🗄️ Database Architecture

The system uses highly relational MongoDB schemas to track library circulation:
- **User**: Stores role (Admin/Student), credentials, and contact info.
- **Book (Catalog)**: Tracks total stock, available copies, and book details.
- **Issue**: The bridge model connecting users to books with due dates and fine status.
- **Notification**: Personal alerts for overdue items and system updates.

---

## 🚀 Local Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_google_app_password
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Run the Project
- **Backend**: `npm run dev` (Runs on port 5000)
- **Frontend**: `npm run dev` (Runs on port 3000)

---

## 🌍 Production Deployment

### 1. Generate Frontend Build
In the `frontend` directory, run:
```bash
npm run build
```
This generates a `dist` folder. The production backend is pre-configured to serve these static files automatically.

### 2. Hosting (Example: Render / Heroku)
- **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
- **Start Command**: `cd backend && node index.js`
- **Environment Variables**: Ensure all variables from your `.env` (including `MONGO_URI` and `JWT_SECRET`) are added to your hosting provider's dashboard.

---

## 💡 Secure Email Integration
For the automated notification system to work, you MUST use a **Google App Password** (16 characters) instead of your regular Gmail password.
1. Enable 2FA on your Google Account.
2. Search for "App Passwords" in your Google security settings.
3. Select "Other" and name it "SmartLib" to generate your key.

---

## 🏛️ Institutional Branding
This project was developed as a flagship solution for the **Design Thinking & Innovation Lab** at **JNTUGV Vizianagaram**.

© 2025 JNTUGV Vizianagaram. All Rights Reserved.
