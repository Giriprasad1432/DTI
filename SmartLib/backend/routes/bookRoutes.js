import express from 'express';
import {
  getBooks,
  getStats,
  issueBook,
  renewBook,
  returnBook,
  getFine,
  getBookById,
  getStudentById,
  reserveBook,
  getReservations,
  fulfillReservation
} from '../controllers/bookController.js';

const router = express.Router();

// GET /api/books - Fetch books with filtering
router.get('/books', getBooks);

// GET /api/stats - Get library statistics
router.get('/stats', getStats);

// POST /api/issue - Issue a new book
router.post('/issue', issueBook);

// POST /api/renew - Renew a book
router.post('/renew', renewBook);

// POST /api/return - Return a book
router.post('/return', returnBook);

// GET /api/fine - Get fine for a book
router.get('/fine', getFine);

// GET /api/book/:bookId - Get book details by book ID
router.get('/book/:bookId', getBookById);

// GET /api/student/:studentId - Get student details by student ID
router.get('/student/:studentId', getStudentById);

// POST /api/reserve - Reserve a book
router.post('/reserve', reserveBook);

// GET /api/reservations - Get reservations
router.get('/reservations', getReservations);

// POST /api/reservations/:id/fulfill - Fulfill a reservation
router.post('/reservations/:id/fulfill', fulfillReservation);

export default router;