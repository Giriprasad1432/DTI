import IssuedBooks from '../models/IssueBook.js';
import Book from '../models/Book.js';
import Students from '../models/students.js';
import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';

// GET /api/books - Fetch books with filtering
export const getBooks = async (req, res) => {
  try {
    const { role, student_id, search } = req.query;
    let query = {};

    if (role === 'student' && student_id) {
      query.studentId = student_id;
    }

    if (search) {
      query.$or = [
        { bookName: { $regex: search, $options: 'i' } },
        { bookId: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await IssuedBooks.find(query).sort({ issuedDate: -1 });

    const formattedBooks = await Promise.all(books.map(async (book) => {
      const student = await Students.findOne({ studentId: book.studentId });
      const daysLeft = book.returned ? 0 : Math.ceil((book.dueDate - new Date()) / (1000 * 60 * 60 * 24));
      const status = book.returned ? 'returned' :
                    daysLeft < 0 ? 'overdue' :
                    daysLeft <= 3 ? 'due_soon' : 'active';

      return {
        id: book._id,
        book_id: book.bookId,
        title: book.bookName,
        student: book.studentName,
        student_id: book.studentId,
        branch: book.branch,
        year: book.year,
        due_date: book.returned ? null : book.dueDate.toISOString().split('T')[0],
        returned_date: book.returned ? book.returnedDate?.toISOString().split('T')[0] : null,
        days_left: book.returned ? 0 : daysLeft,
        status,
        renewed_count: book.renewedCount,
        mobile: book.mobile,
        fine: book.fine
      };
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/stats - Get library statistics
export const getStats = async (req, res) => {
  try {
    const total = await IssuedBooks.countDocuments({ returned: false });
    const active = await IssuedBooks.countDocuments({
      returned: false,
      dueDate: { $gte: new Date() }
    });
    const dueSoon = await IssuedBooks.countDocuments({
      returned: false,
      dueDate: { $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), $gte: new Date() }
    });
    const overdue = await IssuedBooks.countDocuments({
      returned: false,
      dueDate: { $lt: new Date() }
    });

    res.json({
      total,
      active,
      due_soon: dueSoon,
      overdue
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/issue - Issue a new book
export const issueBook = async (req, res) => {
  try {
    const { book_no, book_name, student_no, student_name, mobile, branch, year } = req.body;

    // Check if book exists in catalog and is available
    const bookInCatalog = await Book.findOne({ bookId: book_no });
    if (!bookInCatalog) {
      return res.status(400).json({ error: 'Book not found in catalog' });
    }
    if (bookInCatalog.availableCopies <= 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

    // Check if student exists
    const student = await Students.findOne({ studentId: student_no });
    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    // Check if student already has this book
    const existingIssue = await IssuedBooks.findOne({
      studentId: student_no,
      bookId: book_no,
      returned: false
    });
    if (existingIssue) {
      return res.status(400).json({ error: 'Student already has this book' });
    }

    // Create issue record
    const issueRecord = new IssuedBooks({
      studentId: student_no,
      studentName: student_name,
      bookId: book_no,
      bookName: book_name,
      mobile,
      branch,
      year
    });

    await issueRecord.save();

    // Update available copies
    await Book.findOneAndUpdate(
      { bookId: book_no },
      { $inc: { availableCopies: -1 } }
    );

    res.json({ success: true, id: issueRecord._id });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/renew - Renew a book
export const renewBook = async (req, res) => {
  try {
    const { id } = req.body;
    const book = await IssuedBooks.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.returned) {
      return res.status(400).json({ error: 'Book already returned' });
    }

    if (book.renewedCount >= 2) {
      return res.status(400).json({ error: 'Maximum renewals reached (2 renewals allowed)' });
    }

    // Extend due date by 7 days
    const newDueDate = new Date(book.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    await IssuedBooks.findByIdAndUpdate(id, {
      dueDate: newDueDate,
      renewedCount: book.renewedCount + 1
    });

    res.json({
      success: true,
      new_due_date: newDueDate.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error renewing book:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/return - Return a book
export const returnBook = async (req, res) => {
  try {
    const { id } = req.body;
    const book = await IssuedBooks.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.returned) {
      return res.status(400).json({ error: 'Book already returned' });
    }

    // Calculate fine if overdue
    const daysOverdue = Math.floor((new Date() - book.dueDate) / (1000 * 60 * 60 * 24));
    const fine = daysOverdue > 0 ? daysOverdue * 2 : 0;

    await IssuedBooks.findByIdAndUpdate(id, {
      returned: true,
      returnedDate: new Date(),
      fine
    });

    // Update available copies
    await Book.findOneAndUpdate(
      { bookId: book.bookId },
      { $inc: { availableCopies: 1 } }
    );

    // Check if any student has an active reservation for this book
    const nextReservation = await Reservation.findOne({
      bookId: book.bookId,
      status: 'active'
    }).sort({ reservationDate: 1 }); // oldest reservation first (FIFO queue)

    if (nextReservation) {
      // Mark reservation as 'notified' — starts 24h expiry countdown
      await Reservation.findByIdAndUpdate(nextReservation._id, {
        status: 'notified',
        notifiedAt: new Date()
      });

      // Push an in-app notification to the student
      await new Notification({
        studentId: nextReservation.studentId,
        title: 'Reserved Book Available!',
        message: `Great news! Your reserved book "${nextReservation.bookName}" is now available in the library. Please collect it within 24 hours or the reservation will expire.`,
        type: 'system',
        bookId: nextReservation.bookId
      }).save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/fine - Get fine for a book
export const getFine = async (req, res) => {
  try {
    const { id } = req.query;
    const book = await IssuedBooks.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const daysOverdue = Math.floor((new Date() - book.dueDate) / (1000 * 60 * 60 * 24));
    const fine = daysOverdue > 0 ? daysOverdue * 2 : 0;

    res.json({ fine });
  } catch (error) {
    console.error('Error calculating fine:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/book/:bookId - Get book details by book ID
export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/student/:studentId - Get student details by student ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Students.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      studentId: student.studentId,
      name: student.name,
      mobile: student.mobile,
      branch: student.branch,
      year: student.year
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/reserve - Reserve a book
export const reserveBook = async (req, res) => {
  try {
    const { book_no, book_name, student_no, student_name, mobile, branch, year } = req.body;

    // Check if book exists in catalog
    const bookInCatalog = await Book.findOne({ bookId: book_no });
    if (!bookInCatalog) {
      return res.status(400).json({ error: 'Book not found in catalog' });
    }

    // Check if student exists
    const student = await Students.findOne({ studentId: student_no });
    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    // Check if student already has an active reservation for this book
    const existingReservation = await Reservation.findOne({
      studentId: student_no,
      bookId: book_no,
      status: 'active'
    });
    if (existingReservation) {
      return res.status(400).json({ error: 'You already have an active reservation for this book' });
    }

    // Create reservation record
    const reservationRecord = new Reservation({
      studentId: student_no,
      studentName: student_name,
      bookId: book_no,
      bookName: book_name,
      mobile,
      branch,
      year
    });

    await reservationRecord.save();

    res.json({ success: true, id: reservationRecord._id });
  } catch (error) {
    console.error('Error reserving book:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/reservations - Get reservations
export const getReservations = async (req, res) => {
  try {
    const { role, student_id, search } = req.query;
    let query = {};

    if (role === 'student' && student_id) {
      query.studentId = student_id;
    }

    if (search) {
      query.$or = [
        { bookName: { $regex: search, $options: 'i' } },
        { bookId: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const reservations = await Reservation.find(query).sort({ reservationDate: -1 });

    const formattedReservations = reservations.map(reservation => ({
      id: reservation._id,
      book_id: reservation.bookId,
      title: reservation.bookName,
      student: reservation.studentName,
      student_id: reservation.studentId,
      branch: reservation.branch,
      year: reservation.year,
      reservation_date: reservation.reservationDate.toISOString().split('T')[0],
      expiry_date: reservation.expiryDate.toISOString().split('T')[0],
      status: reservation.status,
      mobile: reservation.mobile
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/reservations/:id/fulfill - Fulfill a reservation
export const fulfillReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.status !== 'active' && reservation.status !== 'notified') {
      return res.status(400).json({ error: 'Reservation is not active or awaiting pickup' });
    }

    // Check if book is available
    const book = await Book.findOne({ bookId: reservation.bookId });
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Update reservation status
    await Reservation.findByIdAndUpdate(id, { status: 'fulfilled' });

    // Issue the book automatically
    const issueRecord = new IssuedBooks({
      studentId: reservation.studentId,
      studentName: reservation.studentName,
      bookId: reservation.bookId,
      bookName: reservation.bookName,
      mobile: reservation.mobile,
      branch: reservation.branch,
      year: reservation.year
    });

    await issueRecord.save();

    // Update available copies
    await Book.findOneAndUpdate(
      { bookId: reservation.bookId },
      { $inc: { availableCopies: -1 } }
    );

    res.json({ success: true, issued_book_id: issueRecord._id });
  } catch (error) {
    console.error('Error fulfilling reservation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};