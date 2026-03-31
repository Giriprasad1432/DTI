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
import { getCatalog } from '../controllers/adminController.js';
import { verifyToken, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All book-related routes require authentication
router.use(verifyToken);

// ── Shared Routes (Admin & Student) ──
router.get('/books', getBooks);
router.get('/catalog', getCatalog);
router.get('/stats', getStats);
router.get('/fine', getFine);
router.get('/book/:bookId', getBookById);
router.get('/reservations', getReservations);
router.post('/reserve', reserveBook);

// ── Admin-Only Routes ──
router.post('/issue',       adminOnly, issueBook);
router.post('/renew',       adminOnly, renewBook);
router.post('/return',      adminOnly, returnBook);
router.get('/student/:studentId', adminOnly, getStudentById);
router.post('/reservations/:id/fulfill', adminOnly, fulfillReservation);

export default router;