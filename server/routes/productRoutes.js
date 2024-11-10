import express from 'express';
import Product from '../models/product.model.js'; // Adjust path if necessary

const router = express.Router();

// Route to get all products with filtering, sorting, and searching
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(12)
      .select('item_name price main_image brand');

    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.item_name[0]?.value || 'Unknown Product',
      price: product.price,
      image: `data:image/jpeg;base64,${product.main_image.toString('base64')}`,
      brand: product.brand[0]?.value || 'Unknown Brand'
    }));

    res.json({
      count: transformedProducts.length,
      products: transformedProducts
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
