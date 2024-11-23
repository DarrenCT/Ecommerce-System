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

export default router;
