const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // For creating and verifying tokens
const bcrypt = require('bcrypt'); // For hashing and comparing passwords

// Mock user data (replace with your database)
const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: '$2b$10$9DsGFo7Z5PbcYsBuVLwiV.XfDeyRbSQVt1Ql.9ZdThRUmb7XpI57a', // Hashed password
  },
];

// Secret key for JWT (replace with a secure key)
const jwtSecretKey = 'your-secret-key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email (replace with a database query)
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare the provided password with the stored hash
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, jwtSecretKey);

  res.json({ token });
});

module.exports = router;
