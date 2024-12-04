import express from 'express';
import User from '../models/registration.model.js'; 
import { v4 as uuidv4 } from 'uuid';

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

        // Generate a unique cardId
        const cardId = uuidv4();

        // Find the user by `userId`
        const user = await User.findOneAndUpdate(
            { userId: req.params.id },
            { 
                $push: { 
                    creditCards: { 
                        cardId,
                        cardNumber, 
                        expiryDate, 
                        cvv 
                    } 
                } 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Credit card added successfully", user });
    } catch (error) {
        console.error('Error adding credit card:', error);
        res.status(500).json({ message: "Error adding credit card", error: error.message });
    }
});

// Delete Credit Card Route
router.delete('/user/:userId/credit-card/:cardId', async (req, res) => {
    try {
        const { userId, cardId } = req.params;
        console.log('DELETE request received:', { userId, cardId });

        // Find user first to check credit cards
        const userBefore = await User.findOne({ userId });
        console.log('User before deletion:', {
            userId: userBefore?.userId,
            creditCards: userBefore?.creditCards.map(card => ({
                cardId: card.cardId,
                cardNumber: card.cardNumber
            }))
        });

        const user = await User.findOneAndUpdate(
            { userId, "creditCards.cardId": cardId },
            { $pull: { creditCards: { cardId: cardId } } },
            { new: true }
        );

        if (!user) {
            console.log('User not found or card not found for userId:', userId, 'cardId:', cardId);
            return res.status(404).json({ message: "User or credit card not found" });
        }

        console.log('User after deletion:', {
            userId: user.userId,
            creditCards: user.creditCards.map(card => ({
                cardId: card.cardId,
                cardNumber: card.cardNumber
            }))
        });
        res.status(200).json({ message: "Credit card deleted successfully", user });
    } catch (error) {
        console.error('Error in DELETE route:', error);
        res.status(500).json({ message: "Error deleting credit card", error: error.message });
    }
});

// Get User Route (including credit cards)
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

export default router;
