import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import connectDB from './config/db.js';
import StudentRoutes from './routes/StudentRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import BookRoutes from './routes/bookRoutes.js';
import AuthRoutes from './routes/authRoutes.js';
import NotificationRoutes from './routes/NotificationRoutes.js';
import { initCronJobs } from './cron/overdueCron.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to Database & Start Cron Jobs
connectDB();
initCronJobs();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://localhost:3001", "http://127.0.0.1:3001",
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:5000", "http://127.0.0.1:5000",
    "https://dti-j286.onrender.com"
  ],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

// API Routes
app.use('/api/student', StudentRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api', BookRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/notifications', NotificationRoutes);

// ── PRODUCTION: Serve Frontend Static Files ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build if it exists
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for SPA (React) — ignore /api routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(200).send('SmartLib Backend is running. Please build the frontend to view the UI.');
    }
  });
});

app.listen(port, () => {
    console.log(`🚀 SmartLib Server running on http://localhost:${port}`);
});