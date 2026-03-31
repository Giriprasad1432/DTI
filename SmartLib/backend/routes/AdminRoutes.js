import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
import adminAuth from '../models/AdminAuth.js';
import adminLogin, {
  getAllStudents,
  getOverdueBooks,
  getCatalog,
  addBookToCatalog,
  deleteFromCatalog
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Received POST request:', req.body);
    try {
        const newAdmin = await Admin.create(req.body);
        console.log('Admin created:', newAdmin);
        res.status(201).json({ message: 'Admin Added!', data: newAdmin });
    } catch (err) {
        console.error('Error creating Admin:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/register', async (req, res) => {
    console.log('Received POST request:', req.body);
    try {
        const newAdmin = await adminAuth.create(req.body);
        console.log('Admin created:', newAdmin);
        res.status(201).json({ message: 'Admin Added!', id:newAdmin.adminId });
    } catch (err) {
        console.error('Error creating Admin:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', adminLogin);

// GET /api/admin/students - Get all students
router.get('/students', getAllStudents);

// GET /api/admin/overdue - Get overdue books
router.get('/overdue', getOverdueBooks);

// GET /api/admin/catalog - Get book catalog
router.get('/catalog', getCatalog);

// POST /api/admin/catalog - Add book to catalog
router.post('/catalog', addBookToCatalog);

// DELETE /api/admin/catalog/:id - Delete book from catalog
router.delete('/catalog/:id', deleteFromCatalog);

// PUT /api/admin/update-profile
router.put('/update-profile', async (req, res) => {
    try {
        const { adminId, name, email, mobile } = req.body;
        if (!adminId) return res.status(400).json({ error: 'Admin ID required' });

        const updated = await Admin.findOneAndUpdate(
            { adminId },
            { name, email, mobile },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Admin not found' });

        res.json({ success: true, user: updated });
    } catch (err) {
        console.error('Error updating admin profile:', err);
        res.status(500).json({ error: 'Failed to update admin profile' });
    }
});

// PUT /api/admin/change-password
router.put('/change-password', async (req, res) => {
    try {
        const { adminId, currentPassword, newPassword } = req.body;
        if (!adminId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const auth = await adminAuth.findOne({ adminId });
        if (!auth) return res.status(404).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(currentPassword, auth.password);
        if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

        auth.password = newPassword;
        await auth.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing admin password:', err);
        res.status(500).json({ error: 'Failed to change admin password' });
    }
});

export default router;