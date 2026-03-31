import express from 'express';
import { getNotifications, markAsRead, sendAdminMessage } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.post('/admin/send', sendAdminMessage);

export default router;
