import Notification from '../models/Notification.js';

// GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        const { studentId } = req.query;
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }
        
        const notifications = await Notification.find({ studentId }).sort({ createdAt: -1 });
        const unreadCount = notifications.filter(n => !n.isRead).length;

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Server error fetching notifications' });
    }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        
        res.json({ success: true, notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Server error marking read' });
    }
};

// POST /api/notifications/admin/send
export const sendAdminMessage = async (req, res) => {
    try {
        const { studentId, message } = req.body;
        
        if (!studentId || !message) {
            return res.status(400).json({ error: 'Student ID and message required' });
        }

        const newNotification = new Notification({
            studentId,
            title: 'Message from Admin',
            message,
            type: 'admin'
        });

        await newNotification.save();
        res.json({ success: true, notification: newNotification });
    } catch (error) {
        console.error('Error sending admin message:', error);
        res.status(500).json({ error: 'Server error sending message' });
    }
};
