import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// Search route MUST come before the :id route
router.get('/api/products/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 12, categories: selectedCategoryParams } = req.query;
    const selectedCategories = selectedCategoryParams ? selectedCategoryParams.split(',') : [];
    
    const searchRegex = new RegExp(q, 'i');
    const baseQuery = {
      $or: [
        { 'item_name.value': searchRegex },
        { 'brand.value': searchRegex }
      ]
    };

    // Add category filter if categories are selected
    if (selectedCategories.length > 0) {
      baseQuery['node.0.node_name'] = {
        $regex: new RegExp(selectedCategories.map(cat => 
          cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        ).join('|'), 'i')
      };
    }

    // Get all matching products for categories and count
    const allMatchingProducts = await Product.find(baseQuery).select('node');

    // Extract categories from all matching products
    const categories = new Set();
    allMatchingProducts.forEach(product => {
      if (product.node?.[0]?.node_name) {
        const nodePath = product.node[0].node_name.split('/');
        if (nodePath[3]) categories.add(nodePath[3]);
      }
    });

    // Get paginated products
    const products = await Product.find(baseQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('item_name price main_image brand node');

    // Transform products as before
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.item_name[0]?.value || 'Unknown Product',
      price: product.price,
      image: product.main_image ? `data:image/jpeg;base64,${product.main_image.toString('base64')}` : null,
      brand: product.brand[0]?.value || 'Unknown Brand',
      node: product.node || []
    }));

    res.json({
      products: transformedProducts,
      categories: Array.from(categories).sort(),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(allMatchingProducts.length / limit),
        totalProducts: allMatchingProducts.length,
        hasNextPage: page * limit < allMatchingProducts.length,
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
    // Get total count of products
    const totalProducts = await Product.countDocuments({});
    
    // Get 12 random products using aggregation pipeline
    const products = await Product.aggregate([
      { $sample: { size: 12 } },
      { $project: {
        item_name: 1,
        price: 1,
        main_image: 1,
        brand: 1,
        node: 1
      }}
    ]);

    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.item_name[0]?.value || 'Unknown Product',
      price: product.price,
      image: product.main_image ? `data:image/jpeg;base64,${product.main_image.toString('base64')}` : null,
      brand: product.brand[0]?.value || 'Unknown Brand',
      node: product.node || []
    }));

    res.json({
      count: transformedProducts.length,
      products: transformedProducts
    });
  } catch (error) {
    console.error('Server error:', error);
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

// Add this new route to get unique categories
router.get('/api/categories', async (req, res) => {
  try {
    const products = await Product.find({}, 'node');
    const categories = new Set();
    
    products.forEach(product => {
      if (product.node && product.node[0] && product.node[0].node_name) {
        const nodePath = product.node[0].node_name.split('/');
        if (nodePath[3]) {
          categories.add(nodePath[3]);
        }
      }
    });

    res.json({
      categories: Array.from(categories).sort()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

export default router;
