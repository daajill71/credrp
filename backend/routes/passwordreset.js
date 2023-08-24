const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { validateResetToken } = require('../middlewares/authMiddleware'); // Import the middleware
const User = require('../models/User'); // Replace with your user model

// Use the validateResetToken middleware for routes that require a valid reset token
router.post('/password-reset', validateResetToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { user } = req; // Access the user object attached by the middleware

    // Update the user's password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

module.exports = router;
