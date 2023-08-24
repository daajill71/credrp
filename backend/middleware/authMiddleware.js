const User = require('../models/User'); // Replace with your user model

// Middleware to check if the reset token is valid
const validateResetToken = async (req, res, next) => {
  try {
    const { resetToken } = req.body;

    // Find the user by the reset token and check if it's still valid
    const user = await User.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Attach the user object to the request for use in protected routes
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Token validation failed' });
  }
};

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, continue to the next middleware or route handler
    return next();
  }
  // If the user is not authenticated, redirect them to the login page or send an error response
  res.status(401).json({ message: 'Unauthorized' });
};

module.exports = { validateResetToken, isAuthenticated };
