import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter using SMTP
// Assumes using Gmail for demo purposes. Can be adjusted.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOverdueEmail = async (studentEmail, studentName, bookName, dueDate) => {
    // If credentials are not set up, skip trying to send to avoid crashes during dev
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured. Skipping email send.');
        return false;
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Library Alert: Overdue Book - ${bookName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <h2 style="color: #d9534f;">Library Notice: Overdue Book</h2>
                    <p>Dear ${studentName},</p>
                    <p>This is a reminder from SmartLib that the following book you borrowed is currently overdue:</p>
                    <ul>
                        <li><strong>Book Name:</strong> ${bookName}</li>
                        <li><strong>Due Date:</strong> ${new Date(dueDate).toDateString()}</li>
                    </ul>
                    <p>Please return the book as soon as possible to avoid further fines.</p>
                    <p>Thank you,<br/><strong>JNTUGV Library Management</strong></p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Overdue email sent to ${studentEmail}: ${info.response}`);
        return true;
    } catch (error) {
        console.error(`❌ Error sending email to ${studentEmail}:`, error.message);
        return false;
    }
};
