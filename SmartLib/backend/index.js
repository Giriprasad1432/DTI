import express from 'express';
import connectDB from './config/db.js';
import StudentRoutes from './routes/StudentRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import BookRoutes from './routes/bookRoutes.js';
import AuthRoutes from './routes/authRoutes.js';
import NotificationRoutes from './routes/NotificationRoutes.js';
import cors from "cors";
import { initCronJobs } from './cron/overdueCron.js';

const app = express();
const port = 5000;

connectDB();
initCronJobs();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  methods: ["POST", "GET", "PUT", "DELETE"]
}));

app.use('/api/student', StudentRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api', BookRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/notifications', NotificationRoutes);

app.listen(port, () => {
    console.log('backend running on port 5000');
});