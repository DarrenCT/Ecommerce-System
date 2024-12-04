import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/registration.model.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, phoneNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user with plain text password (matching existing system)
        const user = new User({
            email,
            password, // Store password as plain text to match existing system
            name,
            phoneNumber,
            address
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Sign in
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password (plain text comparison to match existing system)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.userId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: 'Logged in successfully',
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
    try {
        const userResponse = req.user.toObject();
        delete userResponse.password;
        res.json({ user: userResponse });
    } catch (error) {
        res.status(401).json({ message: 'Token verification failed' });
    }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const userResponse = req.user.toObject();
        delete userResponse.password;
        res.json({ user: userResponse });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'phoneNumber', 'address'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        const userResponse = req.user.toObject();
        delete userResponse.password;

        res.json({ user: userResponse });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
