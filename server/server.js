import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

//test route to check if server is running
app.get('/', (req, res) => {
    res.send('server is ready');
});

app.use(productRoutes);
app.use(cartRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running on port ${PORT}`);
});



