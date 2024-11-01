import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

//test route to check if server is running
app.get('/', (req, res) => {
    res.send('server is ready');
});

app.use('/api/users', userRoutes);
app.use(productRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`);
});



