import bcrypt from "bcryptjs";
import adminAuth from '../models/AdminAuth.js'
import Admin from "../models/admin.js";
import Students from '../models/students.js';
import IssuedBooks from '../models/IssueBook.js';
import Book from '../models/Book.js';

const adminLogin = async (req, res) => {
  try {
    const { admin_id, password } = req.body;
    const adminId = admin_id; // Map admin_id to adminId
    if (!adminId || !password) {
      return res.status(400).json({ message: "admin ID and password are required" });
    }

    const admins = await adminAuth.findOne({ adminId });
    if (!admins) {
      return res.status(404).json({ message: "admin not found" });
    }

    if (!admins.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const match = await bcrypt.compare(password, admins.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const adminDetails = await Admin.findOne({ adminId });
    let adminData = {};
    if (adminDetails) {
      adminData = adminDetails.toObject();
    } else {
      // Create basic admin data if details not found
      adminData = {
        adminId,
        name: "Admin",
        role: "admin"
      };
    }

    res.status(200).json({
      success: true,
      token: "dummy-token", // In a real app, generate JWT
      user: {
        id: adminData.adminId,
        name: adminData.name,
        role: "admin",
        email: adminData.email || "",
        mobile: adminData.mobile || ""
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/students - Get all students with search
export const getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Students.find(query).sort({ studentId: 1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/overdue - Get overdue books
export const getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await IssuedBooks.find({
      returned: false,
      dueDate: { $lt: new Date() }
    }).populate('student', 'name studentId mobile').sort({ dueDate: 1 });

    const formattedBooks = overdueBooks.map(book => ({
      id: book._id,
      book_id: book.bookId,
      title: book.bookName,
      student: book.studentName,
      student_id: book.studentId,
      due_date: book.dueDate.toISOString().split('T')[0],
      days_overdue: Math.floor((new Date() - book.dueDate) / (1000 * 60 * 60 * 24)),
      mobile: book.mobile
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching overdue books:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/catalog - Get book catalog
export const getCatalog = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { bookId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/catalog - Add book to catalog
export const addBookToCatalog = async (req, res) => {
  try {
    const { book_id, title, author, category, total_copies } = req.body;

    const existingBook = await Book.findOne({ bookId: book_id });
    if (existingBook) {
      return res.status(400).json({ error: 'Book ID already exists' });
    }

    const book = new Book({
      bookId: book_id,
      title,
      author,
      category,
      totalCopies: total_copies,
      availableCopies: total_copies
    });

    await book.save();
    res.json({ success: true, book });
  } catch (error) {
    console.error('Error adding book to catalog:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/catalog/:id - Delete book from catalog
export const deleteFromCatalog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book is currently issued
    const issuedCount = await IssuedBooks.countDocuments({
      bookId: id,
      returned: false
    });

    if (issuedCount > 0) {
      return res.status(400).json({ error: 'Cannot delete book that is currently issued' });
    }

    await Book.findOneAndDelete({ bookId: id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting book from catalog:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default adminLogin;