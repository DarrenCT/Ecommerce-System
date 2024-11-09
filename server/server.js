import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB(); 

const app = express();

//  CORS for requests from frontend
app.use(cors({
  origin: 'http://localhost:5173',  //  frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

//to parse JSON request bodies
app.use(express.json());

// route to check if server is running
app.get('/', (req, res) => {
  res.send('Server is ready');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
