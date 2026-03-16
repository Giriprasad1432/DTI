import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Book from '../models/Book.js'

dotenv.config()

const books = [
  // ── CSE / Programming ──────────────────────────────
  { bookId: 'CSE001', title: 'Introduction to Algorithms',           author: 'Thomas H. Cormen',       category: 'CSE',         totalCopies: 5, availableCopies: 5 },
  { bookId: 'CSE002', title: 'Clean Code',                           author: 'Robert C. Martin',       category: 'CSE',         totalCopies: 4, availableCopies: 4 },
  { bookId: 'CSE003', title: 'The Pragmatic Programmer',             author: 'Andrew Hunt',            category: 'CSE',         totalCopies: 3, availableCopies: 3 },
  { bookId: 'CSE004', title: 'Design Patterns',                      author: 'Gang of Four',           category: 'CSE',         totalCopies: 3, availableCopies: 3 },
  { bookId: 'CSE005', title: 'Operating System Concepts',            author: 'Abraham Silberschatz',   category: 'CSE',         totalCopies: 6, availableCopies: 6 },
  { bookId: 'CSE006', title: 'Computer Networks',                    author: 'Andrew S. Tanenbaum',    category: 'CSE',         totalCopies: 4, availableCopies: 4 },
  { bookId: 'CSE007', title: 'Database System Concepts',             author: 'Abraham Silberschatz',   category: 'CSE',         totalCopies: 5, availableCopies: 5 },
  { bookId: 'CSE008', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'CSE/AI',      totalCopies: 4, availableCopies: 4 },

  // ── ECE ────────────────────────────────────────────
  { bookId: 'ECE001', title: 'Electronic Devices and Circuit Theory', author: 'Robert Boylestad',     category: 'ECE',         totalCopies: 5, availableCopies: 5 },
  { bookId: 'ECE002', title: 'Signals and Systems',                   author: 'Alan V. Oppenheim',    category: 'ECE',         totalCopies: 4, availableCopies: 4 },
  { bookId: 'ECE003', title: 'Digital Logic and Computer Design',     author: 'M. Morris Mano',       category: 'ECE',         totalCopies: 4, availableCopies: 4 },
  { bookId: 'ECE004', title: 'Microelectronics Circuit Analysis',     author: 'Donald Neamen',        category: 'ECE',         totalCopies: 3, availableCopies: 3 },

  // ── MECH ───────────────────────────────────────────
  { bookId: 'MCH001', title: 'Engineering Mechanics',                 author: 'R.C. Hibbeler',        category: 'MECH',        totalCopies: 5, availableCopies: 5 },
  { bookId: 'MCH002', title: 'Thermodynamics: An Engineering Approach', author: 'Yunus Cengel',      category: 'MECH',        totalCopies: 4, availableCopies: 4 },
  { bookId: 'MCH003', title: 'Strength of Materials',                 author: 'R.K. Bansal',         category: 'MECH',        totalCopies: 4, availableCopies: 4 },

  // ── CIVIL ──────────────────────────────────────────
  { bookId: 'CIV001', title: 'Structural Analysis',                   author: 'R.C. Hibbeler',        category: 'CIVIL',       totalCopies: 4, availableCopies: 4 },
  { bookId: 'CIV002', title: 'Fluid Mechanics',                       author: 'Frank M. White',       category: 'CIVIL',       totalCopies: 3, availableCopies: 3 },

  // ── EEE ────────────────────────────────────────────
  { bookId: 'EEE001', title: 'Power Systems Engineering',             author: 'C.L. Wadhwa',          category: 'EEE',         totalCopies: 4, availableCopies: 4 },
  { bookId: 'EEE002', title: 'Electrical Machines',                   author: 'I.J. Nagrath',         category: 'EEE',         totalCopies: 4, availableCopies: 4 },

  // ── General / Aptitude ─────────────────────────────
  { bookId: 'GEN001', title: 'Quantitative Aptitude',                 author: 'R.S. Aggarwal',        category: 'General',     totalCopies: 6, availableCopies: 6 },
]

async function seedBooks() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SmartLib')
    console.log('MongoDB connected')

    await Book.deleteMany({})
    console.log('Cleared existing books')

    await Book.insertMany(books)
    console.log(`✅ Inserted ${books.length} books successfully`)

    mongoose.disconnect()
  } catch (err) {
    console.error('Seed error:', err.message)
    process.exit(1)
  }
}

seedBooks()
