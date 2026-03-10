import mongoose from 'mongoose';

const IssueBookSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    IssuedDate: {
        type: Date,
        default: Date.now
    },
    returned: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

export default mongoose.model('IssuedBooks', IssueBookSchema);