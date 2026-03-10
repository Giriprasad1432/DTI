import express from 'express';
import Students from '../models/students.js';
import studentLogin from '../controllers/studentController.js';

const router = express.Router();

router.post('/student', async (req, res) => {
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

router.post('/login/student',studentLogin)

export default router;