const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User'); // Replace with your user model

router.post('/password-reset-request', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Find the user by email and update their reset token and expiration time
    const user = await User.findOneAndUpdate(
      { email },
      {
        resetToken,
        resetTokenExpires: Date.now() + 3600000, // Token expiration in 1 hour
      }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send a reset email to the user
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail email
        pass: 'your-password', // Replace with your Gmail password
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of your password. Please click on the following link to reset your password: ${process.env.CLIENT_URL}/reset/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Email sending failed' });
      }
      return res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Password reset request failed' });
  }
});

module.exports = router;
