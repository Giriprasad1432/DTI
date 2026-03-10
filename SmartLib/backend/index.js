import express from 'express';
import connectDB from './config/db.js';
import StudentRoutes from './routes/StudentRoutes.js';
import cors from "cors";
const app = express();
const port = 5000;

connectDB();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "GET"]
}));

app.use('/api',StudentRoutes);

app.listen(port, () => {
    console.log('backend running on port 5000');
});