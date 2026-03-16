import express from 'express';
import { logout } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

export default router;