import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
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
    mobile: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    reservationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'notified', 'fulfilled', 'expired'],
        default: 'active'
    },
    notifiedAt: {
        type: Date,
        default: null
    },
    expiryDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
}, { timestamps: true });

export default mongoose.model('Reservation', ReservationSchema);