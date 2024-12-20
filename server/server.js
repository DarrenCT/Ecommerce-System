import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import signInRoutes from './routes/signInRoutes.js';
import MyAccountRoutes from './routes/myAccountRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors()); // This allows all origins

//test route to check if server is running
app.get('/', (req, res) => {
    res.send('server is ready');
});

// Use routes
app.use(signInRoutes); 
app.use('/api/auth', authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(userRoutes);
app.use(MyAccountRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`);
});
