import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Students from '../models/students.js'

dotenv.config()

const students = [
  { studentId: '21CSE001', name: 'Alice Johnson', mobile: '9876543210' },
  { studentId: '21CSE002', name: 'Bob Smith', mobile: '9876543211' },
  { studentId: '21ECE001', name: 'Charlie Brown', mobile: '9876543212' },
  { studentId: '21MECH001', name: 'Diana Prince', mobile: '9876543213' },
  { studentId: '21CIVIL001', name: 'Eve Wilson', mobile: '9876543214' },
  { studentId: '21EEE001', name: 'Frank Miller', mobile: '9876543215' },
  { studentId: '21IT001', name: 'Grace Lee', mobile: '9876543216' },
  { studentId: '21MET001', name: 'Henry Davis', mobile: '9876543217' },
]

async function seedStudents() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SmartLib')
    console.log('MongoDB connected')

    await Students.deleteMany({})
    console.log('Cleared existing students')

    await Students.insertMany(students)
    console.log(`✅ Inserted ${students.length} students successfully`)

    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err.message)
    process.exit(1)
  }
}

seedStudents()