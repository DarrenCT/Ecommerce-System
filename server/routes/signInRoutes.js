import express from 'express';
import User from '../models/registration.model.js';

const router = express.Router();

// Sign-in route 
router.post('/sign_in', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Send successful response with `userId`
    res.status(200).json({ 
      message: 'Sign-in successful', 
      user: { 
        userId: user.userId, // Include `userId` from the database
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Error in sign-in route:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;
