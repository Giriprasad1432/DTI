import express from 'express';
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

export default router;