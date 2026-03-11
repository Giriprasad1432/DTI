import express from 'express';
import Admin from '../models/admin.js';
import adminAuth from '../models/AdminAuth.js';
import adminLogin from '../controllers/adminController.js';

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

router.post('/login',adminLogin)

export default router;