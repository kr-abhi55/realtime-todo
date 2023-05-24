import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
import Utils from './Utils.js';

export default async function MongoDbHelper(dbName: string) {
    const MONGO_URI = Utils.env.MONGO_URI + dbName;
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}