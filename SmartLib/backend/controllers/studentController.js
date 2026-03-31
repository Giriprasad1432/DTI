import studentAuth from "../models/StudentAuth.js";
import Students from "../models/students.js";
import IssuedBooks from '../models/IssueBook.js';
import bcrypt from "bcryptjs";

const studentLogin = async (req, res) => {
  try {
    const { roll_no, password } = req.body;
    const studentId = roll_no; // Map roll_no to studentId
    if (!studentId || !password) {
      return res.status(400).json({ message: "Student ID and password are required" });
    }

    const student = await studentAuth.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const studentDetails = await Students.findOne({ studentId });
    let studentData = {};
    if (studentDetails) {
      studentData = studentDetails.toObject();
    } else {
      // Create basic student data if details not found
      studentData = {
        studentId,
        name: "Student",
        mobile: "",
        branch: "CSE",
        year: "1st Year"
      };
    }

    res.status(200).json({
      success: true,
      token: "dummy-token", // In a real app, generate JWT
      user: {
        id: studentData.studentId,
        name: studentData.name,
        branch: studentData.branch || "CSE",
        year: studentData.year || "1st Year",
        role: "student",
        mobile: studentData.mobile,
        email: studentData.email || ""
      }
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/books/my - Get student's borrowed books
export const getMyBooks = async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required' });
    }

    const books = await IssuedBooks.find({
      studentId: student_id,
      returned: false
    }).sort({ issuedDate: -1 });

    const formattedBooks = books.map(book => {
      const daysLeft = Math.ceil((book.dueDate - new Date()) / (1000 * 60 * 60 * 24));
      const status = daysLeft < 0 ? 'overdue' :
                    daysLeft <= 3 ? 'due_soon' : 'active';

      return {
        id: book._id,
        book_id: book.bookId,
        title: book.bookName,
        due_date: book.dueDate.toISOString().split('T')[0],
        days_left: daysLeft,
        status,
        renewed_count: book.renewedCount
      };
    });

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching my books:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/fines/my - Get student's fines
export const getMyFines = async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required' });
    }

    const books = await IssuedBooks.find({
      studentId: student_id,
      returned: true,
      fine: { $gt: 0 }
    });

    const totalFine = books.reduce((sum, book) => sum + book.fine, 0);

    const formattedBooks = books.map(book => ({
      id: book._id,
      title: book.bookName,
      fine: book.fine
    }));

    res.json({
      total_fine: totalFine,
      books: formattedBooks
    });
  } catch (error) {
    console.error('Error fetching my fines:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/history - Get student's borrow history
export const getBorrowHistory = async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required' });
    }

    const books = await IssuedBooks.find({
      studentId: student_id,
      returned: true
    }).sort({ returnedDate: -1 });

    const history = books.map(book => ({
      title: book.bookName,
      issued_on: book.issuedDate.toISOString().split('T')[0],
      returned_on: book.returnedDate.toISOString().split('T')[0]
    }));

    res.json(history);
  } catch (error) {
    console.error('Error fetching borrow history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default studentLogin;