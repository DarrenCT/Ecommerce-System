import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/registration.model.js';

const router = express.Router();

// Sign-in route 
router.post('/api/sign_in', async (req, res) => {
  const { email, password } = req.body;
  console.log('Sign-in attempt:', { email });

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored password
    console.log('Comparing passwords');
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    console.log('Generating JWT token');
    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send successful response with user data and token
    console.log('Sign-in successful');
    res.status(200).json({ 
      message: 'Sign-in successful', 
      token,
      user: { 
        userId: user.userId,
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Detailed error in sign-in route:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;
