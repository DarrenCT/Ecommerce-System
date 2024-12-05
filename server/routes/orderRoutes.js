import express from 'express';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';

const router = express.Router();

router.post('/api/orders', async (req, res) => {
    try {
        const { cartId, shippingAddress, billingAddress, userId } = req.body;

        // Get the cart
        const cart = await Cart.findOne({ cartId })
            .populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
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
            billingAddress,
            status: 'pending'
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
        console.error('Error in /api/orders:', error);
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message 
        });
    }
});

router.get('/api/orders/history', async (req, res) => {
    try {
        const { customerId, productId, startDate, endDate } = req.query;
        
        // Build the query
        const query = {};
        
        if (customerId) {
            query.userId = customerId;
        }
        
        if (productId) {
            query['items.product'] = productId;
        }
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // Get orders with populated product details
        const orders = await Order.find(query)
            .populate({
                path: 'items.product',
                select: 'item_name price' // Select item_name instead of name
            })
            .sort({ createdAt: -1 });

        // Convert timestamps to Toronto time
        const torontoOrders = orders.map(order => {
            const orderObj = order.toObject();
            const torontoTime = new Date(order.createdAt).toLocaleString("en-US", {
                timeZone: "America/Toronto"
            });
            return {
                ...orderObj,
                createdAt: torontoTime
            };
        });

        res.json(torontoOrders);
    } catch (error) {
        console.error('Error in /api/orders/history:', error);
        res.status(500).json({ 
            message: 'Error fetching sales history', 
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