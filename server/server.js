import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Development middleware to simulate authenticated user
app.use((req, res, next) => {
  // Simulate a logged-in user for development
  req.user = {
    id: 'dev-user-' + uuidv4(),
    name: 'Development User',
    email: 'dev@example.com',
    isAdmin: true
  };
  next();
});

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



