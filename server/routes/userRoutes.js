import express from 'express';
import User from '../models/registration.model.js'; 

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, name, phoneNumber, address } = req.body;

        //validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email, password, and name are required." });
        }

        // if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // new user
        const newUser = new User({ email, password, name, phoneNumber, address });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

export default router;
