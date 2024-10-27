import express from 'express';
import Product from '../models/product.model.js'; // Adjust path if necessary

const router = express.Router();

// Route to get all products with filtering, sorting, and searching
router.get('/api/products', async (req, res) => {
  try {
    const { category, genre, brand, search, sortBy, sortOrder, minPrice, maxPrice } = req.query;
    let query = {};

    // Filtering
    if (category) query.category = category;
    if (genre) query.genre = genre;
    if (brand) query.brand = brand;

    // Price range filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Searching
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const products = await Product.find(query)
      .sort(sort)
      .select('name price image category genre brand description quantity'); // Explicitly select fields we want to return

    res.json({
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get a single product by ID
router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to create a new product
router.post('/api/products', async (req, res) => {
  const { name, price, image, category, genre, brand, description, quantity } = req.body;
  try {
    const product = new Product({ name, price, image, category, genre, brand, description, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
});

export default router;
