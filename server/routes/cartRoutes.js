import express from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get cart
router.get('/api/cart/:cartId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ cartId: req.params.cartId })
            .populate('items.product', 'item_name price main_image quantity');
        
        if (!cart) {
            cart = new Cart({ 
                cartId: req.params.cartId, 
                items: [] 
            });
            await cart.save();
        }
        
        await cart.calculateTotalAmount();
        await cart.save();
        
        // Transform the cart items to include properly formatted images
        cart = cart.toObject(); // Convert to plain object for manipulation
        cart.items = cart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null
            }
        }));
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Create new cart
router.post('/api/cart', async (req, res) => {
    try {
        const cartId = uuidv4();
        const cart = new Cart({ cartId, items: [] });
        await cart.save();
        res.status(201).json({ cartId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating cart', error: error.message });
    }
});

// Add item to cart
router.post('/api/cart/:cartId/items', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough inventory' });
        }

        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.calculateTotalAmount();
        await cart.save();
        cart = await cart.populate('items.product', 'item_name price main_image quantity');
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// Update cart item quantity
router.put('/api/cart/:cartId/items/:productId', async (req, res) => {
    try {
        const { quantity } = req.body;
        
        // Validate quantity
        if (quantity < 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }
        
        //will use userId in the future
        //let cart = await Cart.findOne({ userId: req.params.userId });
        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === req.params.productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            // Validate inventory
            const product = await Product.findById(req.params.productId);
            if (product.quantity < quantity) {
                return res.status(400).json({ message: 'Not enough inventory' });
            }
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.calculateTotalAmount();
        await cart.save();

        cart = await cart.populate('items.product', 'item_name price main_image quantity');
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

// Remove item from cart
router.delete('/api/cart/:cartId/items/:productId', async (req, res) => {
    try {
        //will use userId in the future
        //let cart = await Cart.findOne({ userId: req.params.userId });
        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== req.params.productId
        );

        await cart.calculateTotalAmount();
        await cart.save();

        cart = await cart.populate('items.product', 'item_name price main_image quantity');
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
});

export default router;
