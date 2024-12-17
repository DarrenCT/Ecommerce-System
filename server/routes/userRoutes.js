import express from 'express';
import User from '../models/registration.model.js'; 

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phoneNumber, address } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password, and name are required." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Create a new user
        const newUser = new User({ email, password, name, phoneNumber, address });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error('Error in registration route:', error);  // For debugging
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Add Credit Card Route
router.post('/user/:id/credit-card', async (req, res) => {
    try {
        const { cardNumber, expiryDate, cvv } = req.body;

        // Validate required fields
        if (!cardNumber || !expiryDate || !cvv) {
            return res.status(400).json({ message: "All credit card fields are required." });
        }

        // Find the user by `userId`
        const user = await User.findOneAndUpdate(
            { userId: req.params.id },
            { 
                $push: { 
                    creditCards: { 
                        cardNumber, 
                        expiryDate, 
                        cvv 
                    } 
                } 
            },
            { new: true } // Return the updated user document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Credit card added successfully.", user });
    } catch (error) {
        console.error('Error adding credit card:', error);  // For debugging
        res.status(500).json({ message: "Error adding credit card.", error: error.message });
    }
});

// Fetch all users (customers)
router.get('/api/customers', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers.' });
    }
});

// Fetch details of a single user (customer) by userId
router.get('/api/customers/:id', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }); // Match by userId
        if (!user) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).json({ message: 'Error fetching customer details.' });
    }
});


// Update customer information by userId
router.put('/api/customers/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.id }, // Ensure you're using userId consistently
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating customer information:', error);
        res.status(500).json({ message: 'Error updating customer information.' });
    }
});

router.post('/user/:id/shipping-address', async (req, res) => {
    try {
        const { id } = req.params;
        const { street, city, state, postalCode, country } = req.body;

        // Validate input
        if (!street || !city || !state || !postalCode || !country) {
            return res.status(400).json({ message: "All fields are required." });
        }
       
        const user = await User.findOne({ userId: id }); 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
       
        user.shippingAddresses.push({
            street,
            city,
            province,
            postalCode,
            country,
        });

        await user.save();

        res.status(200).json({ message: "Shipping address added successfully.", user });
    } catch (error) {
        console.error("Error adding shipping address:", error);
        res.status(500).json({ message: "Error adding shipping address.", error: error.message });
    }
});

//update purchase history
router.post('/user/:id/purchase-history', async (req, res) => {
    try {
        const { id } = req.params; // User ID passed in the URL
        const { orderId, items, totalAmount } = req.body;

        // Validate input
        if (!orderId || !items || items.length === 0 || !totalAmount) {
            return res.status(400).json({ message: "Invalid purchase data." });
        }

        // Find the user by userId, not _id
        const user = await User.findOne({ userId: id }); // Query by userId
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Add purchase history
        user.purchaseHistory.push({
            orderId,
            items,
            totalAmount,
        });

        // Save the user
        await user.save();

        res.status(200).json({ message: "Purchase history updated successfully.", user });
    } catch (error) {
        console.error("Error updating purchase history:", error);
        res.status(500).json({ message: "Error updating purchase history.", error: error.message });
    }
});


export default router;
