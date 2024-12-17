import express from 'express';
import User from '../models/registration.model.js'; 

const router = express.Router();

// Fetch user data
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) return res.status(404).send('User not found');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update user data
router.put('/user/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const user = await User.findOneAndUpdate(
            { userId: req.params.id },
            updatedData,
            { new: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;
