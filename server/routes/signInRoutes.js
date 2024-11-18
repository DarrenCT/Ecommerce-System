import express from 'express';
import User from '../models/registration.model.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // compare the provided password with the stored password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // send response
    res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error in sign-in route:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;
