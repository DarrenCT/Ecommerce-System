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

        // If cart has a userId, only allow access if it matches the request
        if (cart.userId && req.query.userId !== cart.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        await cart.calculateTotalAmount();
        await cart.save();
        
        // Transform the cart items to include properly formatted images and check stock
        cart = cart.toObject();
        cart.items = cart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null,
                isOutOfStock: item.product.quantity <= 0
            }
        }));
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Create a new cart
router.post('/api/cart', async (req, res) => {
    try {
        const { userId } = req.body;
        
        // If userId is provided, check if user already has a cart
        if (userId) {
            const existingCart = await Cart.findOne({ userId });
            if (existingCart) {
                return res.json(existingCart);
            }
        }
        
        const cartId = uuidv4();
        const cart = new Cart({ cartId, userId });
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error creating cart', error: error.message });
    }
});

// Add item to cart
router.post('/api/cart/:cartId/items', async (req, res) => {
    try {
        const cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // If cart has a userId, only allow access if it matches the request
        if (cart.userId && req.query.userId !== cart.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { productId, quantity } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if product is out of stock
        if (product.quantity <= 0) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        // Check if there's enough inventory
        if (product.quantity < quantity) {
            return res.status(400).json({ 
                message: 'Not enough inventory', 
                availableQuantity: product.quantity 
            });
        }

        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        // Check total quantity including existing cart items
        const totalQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
        if (product.quantity < totalQuantity) {
            return res.status(400).json({ 
                message: 'Not enough inventory for total quantity', 
                availableQuantity: product.quantity 
            });
        }

        if (existingItem) {
            existingItem.quantity = totalQuantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.calculateTotalAmount();
        await cart.save();
        
        cart = await cart.populate('items.product', 'item_name price main_image quantity');
        
        // Transform response to include stock information
        cart = cart.toObject();
        cart.items = cart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null,
                isOutOfStock: item.product.quantity <= 0
            }
        }));
        
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

        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if product is out of stock
        if (quantity > 0 && product.quantity <= 0) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        // Check if there's enough inventory
        if (quantity > product.quantity) {
            return res.status(400).json({ 
                message: 'Not enough inventory', 
                availableQuantity: product.quantity 
            });
        }

        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // If cart has a userId, only allow access if it matches the request
        if (cart.userId && req.query.userId !== cart.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (quantity === 0) {
            cart.items = cart.items.filter(item => 
                item.product.toString() !== req.params.productId
            );
        } else {
            const cartItem = cart.items.find(item => 
                item.product.toString() === req.params.productId
            );
            if (cartItem) {
                cartItem.quantity = quantity;
            }
        }

        await cart.calculateTotalAmount();
        await cart.save();
        
        cart = await cart.populate('items.product', 'item_name price main_image quantity');
        
        // Transform response to include stock information
        cart = cart.toObject();
        cart.items = cart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null,
                isOutOfStock: item.product.quantity <= 0
            }
        }));
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

// Remove item from cart
router.delete('/api/cart/:cartId/items/:productId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // If cart has a userId, only allow access if it matches the request
        if (cart.userId && req.query.userId !== cart.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== req.params.productId
        );

        await cart.calculateTotalAmount();
        await cart.save();

        cart = await cart.populate('items.product', 'item_name price main_image quantity');
        
        // Transform response to include stock information
        cart = cart.toObject();
        cart.items = cart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null,
                isOutOfStock: item.product.quantity <= 0
            }
        }));
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
});

// Update cart with userId
router.put('/api/cart/:cartId/user', async (req, res) => {
    try {
        const { userId } = req.body;
        
        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            // If no cart exists, create one with the userId
            cart = new Cart({ 
                cartId: req.params.cartId,
                userId: userId,
                items: [] 
            });
        } else {
            // Update existing cart with userId
            cart.userId = userId;
        }
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart with user ID', error: error.message });
    }
});

// Find or create user's cart
router.post('/api/cart/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { currentCartId } = req.body;

        // First, try to find an existing cart for this user
        let userCart = await Cart.findOne({ userId });
        let currentCart = null;

        if (currentCartId) {
            currentCart = await Cart.findOne({ cartId: currentCartId });
        }

        if (userCart) {
            // If user has an existing cart
            if (currentCart && currentCart.items.length > 0) {
                // Merge items from current cart to user's cart
                for (const item of currentCart.items) {
                    const existingItem = userCart.items.find(i => 
                        i.product.toString() === item.product.toString()
                    );
                    
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        userCart.items.push(item);
                    }
                }
                await userCart.calculateTotalAmount();
                await userCart.save();
                
                // Delete the temporary cart
                await Cart.findOneAndDelete({ cartId: currentCartId });
            }
        } else if (currentCart) {
            // If user doesn't have a cart but has a current cart, check if it's already associated with another user
            if (currentCart.userId && currentCart.userId !== userId) {
                // Create a new empty cart for the user
                const cartId = uuidv4();
                userCart = new Cart({ 
                    cartId, 
                    userId,
                    items: []
                });
                await userCart.save();
            } else {
                // If cart is not associated with another user, associate it with current user
                currentCart.userId = userId;
                userCart = currentCart;
                await userCart.save();
            }
        } else {
            // Create a new cart for the user
            const cartId = uuidv4();
            userCart = new Cart({ 
                cartId, 
                userId, 
                items: [] 
            });
            await userCart.save();
        }

        // Populate and transform the cart data
        userCart = await userCart.populate('items.product', 'item_name price main_image quantity');
        userCart = userCart.toObject();
        userCart.items = userCart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null,
                isOutOfStock: item.product.quantity <= 0
            }
        }));

        res.json(userCart);
    } catch (error) {
        res.status(500).json({ message: 'Error managing user cart', error: error.message });
    }
});

// Get user's cart
router.get('/api/cart/user/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
            .populate('items.product', 'item_name price main_image quantity');
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        await cart.calculateTotalAmount();
        await cart.save();
        
        // Transform cart items
        const transformedCart = cart.toObject();
        transformedCart.items = transformedCart.items.map(item => ({
            ...item,
            product: {
                ...item.product,
                main_image: item.product.main_image 
                    ? `data:image/jpeg;base64,${item.product.main_image.toString('base64')}`
                    : null,
                isOutOfStock: item.product.quantity <= 0
            }
        }));
        
        res.json(transformedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user cart', error: error.message });
    }
});

// Update cart's user
router.put('/api/cart/:cartId/user', async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ cartId: req.params.cartId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Update the cart's userId
        cart.userId = userId;
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart user', error: error.message });
    }
});

export default router;
