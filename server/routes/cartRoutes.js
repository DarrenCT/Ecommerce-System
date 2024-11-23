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
        
        // Transform the cart items to include properly formatted images and check stock
        cart = cart.toObject(); // Convert to plain object for manipulation
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
        const cartId = uuidv4();
        const cart = new Cart({ 
            cartId, 
            userId,  
            items: [] 
        });
        await cart.save();
        res.json({ cartId: cart.cartId });
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

        let cart = await Cart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
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
            // If user doesn't have a cart but has a current cart, associate it with the user
            currentCart.userId = userId;
            userCart = currentCart;
            await userCart.save();
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

export default router;
