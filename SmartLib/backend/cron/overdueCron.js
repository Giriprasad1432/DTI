import cron from 'node-cron';
import IssuedBooks from '../models/IssueBook.js';
import Students from '../models/students.js';
import Notification from '../models/Notification.js';
import Reservation from '../models/Reservation.js';
import { sendOverdueEmail } from '../utils/emailService.js';

export const initCronJobs = () => {
    console.log('⏳ Initializing Overdue Emails Cron Job...');
    
    // Runs daily at 8:00 AM (production schedule)
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('⏰ Running overdue books check...');
            
            // Find all books that are NOT returned and the due date has passed
            const today = new Date();
            const overdueBooks = await IssuedBooks.find({
                returned: false,
                dueDate: { $lt: today }
            });

            if (overdueBooks.length === 0) {
                console.log('✅ No overdue books found.');
                return;
            }

            console.log(`⚠️ Found ${overdueBooks.length} overdue books.`);

            // Get all unique student IDs from overdue loans
            const studentIds = [...new Set(overdueBooks.map(book => book.studentId))];
            
            // Fetch student records containing their emails
            const students = await Students.find({ studentId: { $in: studentIds } });

            // Iterate through overdue records and send emails
            for (const book of overdueBooks) {
                const student = students.find(s => s.studentId === book.studentId);
                
                if (student && student.email) {
                    await sendOverdueEmail(
                        student.email, 
                        student.name, 
                        book.bookName, 
                        book.dueDate
                    );

                    // Safeguard: Only create 1 app notification per book per 24 hours
                    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    const recentNotification = await Notification.findOne({
                        studentId: book.studentId,
                        bookId: book.bookId,
                        type: 'overdue',
                        createdAt: { $gte: oneDayAgo }
                    });

                    if (!recentNotification) {
                        await new Notification({
                            studentId: book.studentId,
                            title: 'Overdue Book Alert',
                            message: `Your book "${book.bookName}" is overdue. Please return it to avoid further fines.`,
                            type: 'overdue',
                            bookId: book.bookId
                        }).save();
                    }
                } else {
                    console.warn(`⚠️ Could not find email for student ID: ${book.studentId} (Book: ${book.bookName})`);
                }
            }
        } catch (error) {
            console.error('❌ Error executing overdue cron job:', error.message);
        }
    });

    // ── Reservation Auto-Expiry ──
    // Every 10 minutes, expire 'notified' reservations older than 24 hours
    cron.schedule('*/10 * * * *', async () => {
        try {
            const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

            const expiredReservations = await Reservation.find({
                status: 'notified',
                notifiedAt: { $lt: cutoff }
            });

            if (expiredReservations.length === 0) return;

            console.log(`🔄 Expiring ${expiredReservations.length} uncollected reservation(s)...`);

            for (const reservation of expiredReservations) {
                await Reservation.findByIdAndUpdate(reservation._id, { status: 'expired' });

                // Notify the student that their reservation expired
                await new Notification({
                    studentId: reservation.studentId,
                    title: 'Reservation Expired',
                    message: `Your reservation for \"${reservation.bookName}\" has expired because it was not collected within 24 hours. You can reserve it again from the catalog.`,
                    type: 'system',
                    bookId: reservation.bookId
                }).save();

                console.log(`   ❌ Expired reservation for ${reservation.studentName} → ${reservation.bookName}`);

                // Cascade: notify the next student in queue for the same book
                const nextInQueue = await Reservation.findOne({
                    bookId: reservation.bookId,
                    status: 'active'
                }).sort({ reservationDate: 1 });

                if (nextInQueue) {
                    await Reservation.findByIdAndUpdate(nextInQueue._id, {
                        status: 'notified',
                        notifiedAt: new Date()
                    });

                    await new Notification({
                        studentId: nextInQueue.studentId,
                        title: 'Reserved Book Available!',
                        message: `Great news! Your reserved book \"${nextInQueue.bookName}\" is now available in the library. Please collect it within 24 hours or the reservation will expire.`,
                        type: 'system',
                        bookId: nextInQueue.bookId
                    }).save();

                    console.log(`   🔔 Cascaded notification to next in queue: ${nextInQueue.studentName}`);
                }
            }
        } catch (error) {
            console.error('❌ Error expiring reservations:', error.message);
        }
    });
};
