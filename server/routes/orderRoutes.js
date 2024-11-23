import express from 'express';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';

const router = express.Router();

router.post('/api/orders', async (req, res) => {
    try {
        const { cartId, shippingAddress, billingAddress } = req.body;
        const userId = req.user.id; // From the auth middleware

        // Get the cart
        const cart = await Cart.findOne({ cartId })
            .populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Create the order
        const order = new Order({
            userId,
            cartId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            totalAmount: cart.totalAmount,
            shippingAddress,
            billingAddress
        });

        await order.save();

        // Clear the cart (optional)
        cart.items = [];
        await cart.save();

        res.status(201).json({ 
            message: 'Order created successfully',
            orderId: order._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message 
        });
    }
});

router.get('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate({
                path: 'items.product',
                select: 'item_name main_image price'
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching order', 
            error: error.message 
        });
    }
});

export default router; 