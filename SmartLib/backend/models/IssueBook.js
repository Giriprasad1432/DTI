const mongoose = require('mongoose');

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
    }},
    { timestamps: true }
);

module.exports=mongoose.model('IssuedBooks',IssueBookSchema);