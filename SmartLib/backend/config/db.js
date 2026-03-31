import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SmartLib';
        const conn = await mongoose.connect(uri);
        console.log(`✅ mongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

export default connectDB;