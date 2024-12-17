import express from 'express';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

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

        // Check if all products have sufficient quantity
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product || product.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient quantity available for product: ${product ? product.item_name[0].value : 'Unknown product'}`
                });
            }
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

        // Save the order
        await order.save();

        // Update product quantities
        const updatePromises = cart.items.map(item => 
            Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { quantity: -item.quantity } },
                { new: true }
            )
        );
        await Promise.all(updatePromises);

        // Delete the cart after successful order creation
        await Cart.findOneAndDelete({ cartId });

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
        const { customerId, itemName, startDate, endDate } = req.query;
        
        // Build the query
        const query = {};
        
        if (customerId) {
            query.userId = customerId;
        }
        
        // If itemName is provided, first find products matching the name
        let productIds = [];
        if (itemName) {
            const products = await Product.find({
                'item_name.value': { $regex: new RegExp(itemName, 'i') }
            });
            productIds = products.map(product => product._id);
            if (productIds.length > 0) {
                query['items.product'] = { $in: productIds };
            }
        }
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                // Set endDate to the end of the day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
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