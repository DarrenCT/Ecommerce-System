import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// Search route MUST come before the :id route
router.get('/api/products/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments({
      $or: [
        { 'item_name.value': searchRegex },
        { 'brand.value': searchRegex }
      ]
    });

    const products = await Product.find({
      $or: [
        { 'item_name.value': searchRegex },
        { 'brand.value': searchRegex }
      ]
    })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select('item_name price main_image brand');

    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.item_name[0]?.value || 'Unknown Product',
      price: product.price,
      image: product.main_image ? `data:image/jpeg;base64,${product.main_image.toString('base64')}` : null,
      brand: product.brand[0]?.value || 'Unknown Brand'
    }));

    res.json({
      products: transformedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNextPage: page * limit < totalProducts,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// General products route
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(12)
      .select('item_name price main_image brand');

    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.item_name[0]?.value || 'Unknown Product',
      price: product.price,
      image: product.main_image ? `data:image/jpeg;base64,${product.main_image.toString('base64')}` : null,
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

// Single product route MUST come last
router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

export default router;
