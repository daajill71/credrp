// routes/profile.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import your authentication middleware
const User = require('../models/User'); // Replace with your user model

// Get the user's profile
router.get('/', authMiddleware, async (req, res) => {
  // This route is protected by the authMiddleware
  // Only authenticated users can access it
  try {
    const userId = req.user.id; // Access the user's ID from the authenticated user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update the user's profile
router.put('/', authMiddleware, async (req, res) => {
  // This route is protected by the authMiddleware
  // Only authenticated users can access it
  try {
    const userId = req.user.id;
    const updatedUser = req.body; // Updated user data from the request body
    
    const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

module.exports = router;
