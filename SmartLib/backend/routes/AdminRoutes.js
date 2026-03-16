import express from 'express';
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

export default router;