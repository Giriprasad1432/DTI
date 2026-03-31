import express from 'express';
import bcrypt from 'bcryptjs';
import Students from '../models/students.js';
import studentAuth from '../models/StudentAuth.js';
import studentLogin, { getMyBooks, getMyFines, getBorrowHistory } from '../controllers/studentController.js';

const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Received POST request:', req.body);
    try {
        const newStudent = await Students.create(req.body);
        console.log('Student created:', newStudent);
        res.status(201).json({ message: 'Student Added!', data: newStudent });
    } catch (err) {
        console.error('Error creating student:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/register', async (req, res) => {
    console.log('Received POST request:', req.body);
    try {
        const newStudent = await studentAuth.create(req.body);
        console.log('Student created:', newStudent);
        res.status(201).json({ message: 'Student Added!', id:newStudent.studentId });
    } catch (err) {
        console.error('Error creating student:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/login',studentLogin);

// GET /api/student/books/my - Get student's borrowed books
router.get('/books/my', getMyBooks);

// GET /api/student/fines/my - Get student's fines
router.get('/fines/my', getMyFines);

// GET /api/student/history - Get student's borrow history
router.get('/history', getBorrowHistory);

// PUT /api/student/update-profile - Update student profile (name, email, mobile)
router.put('/update-profile', async (req, res) => {
    try {
        const { studentId, name, email, mobile, branch, year } = req.body;
        if (!studentId) return res.status(400).json({ error: 'Student ID required' });

        const updated = await Students.findOneAndUpdate(
            { studentId },
            { name, email, mobile, branch, year },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Student not found' });

        res.json({ success: true, user: updated });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// PUT /api/student/change-password
router.put('/change-password', async (req, res) => {
    try {
        const { studentId, currentPassword, newPassword } = req.body;
        if (!studentId || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const auth = await studentAuth.findOne({ studentId });
        if (!auth) return res.status(404).json({ error: 'Student not found' });

        const isMatch = await bcrypt.compare(currentPassword, auth.password);
        if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

        auth.password = newPassword;
        await auth.save(); // pre-save hook will hash it

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

export default router;