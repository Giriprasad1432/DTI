import express from 'express';
import { getNotifications, markAsRead, sendAdminMessage } from '../controllers/notificationController.js';
import { verifyToken, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/admin/send', adminOnly, sendAdminMessage);

export default router;
