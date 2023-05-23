import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

export default async function MongoDbHelper(dbName: string) {
    const MONGO_URI = (process.env.MONGO_URI as string) + dbName;
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}