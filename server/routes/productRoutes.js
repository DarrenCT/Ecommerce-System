import express from 'express';
import Product from '../models/product.model.js'; // Adjust path if necessary

const router = express.Router();

// Route to get all products
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create a new product
router.post('/api/products', async (req, res) => {
  const { name, price } = req.body;
  try {
    const product = new Product({ name, price });
    await product.save(); // Save the new product to the database
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
});

export default router;
