import mongoose from 'mongoose';


export const connectDB = async () => {
    try{
        //connect to mongodb using mongo uri from .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: 'e-commerce' });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);  // 1 means exit with failure, 0 means exit with success
    }
}
