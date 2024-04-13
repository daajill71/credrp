const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Route to get a list of clients
router.get('/list', async (req, res) => {
  try {
    // Log before retrieving data
    console.log('Fetching clients...');

    // Retrieve clients from the database
    const clients = await Client.find();

    // Log clients before sending them as a response
    console.log('Clients retrieved successfully:', clients);

    // Send clients as a JSON response
    res.json(clients);
  } catch (err) {
    // Handle errors and log them
    console.error('Error while fetching clients:', err);

    // Send an error response
    res.status(500).json({ error: 'An error occurred while fetching clients.' });
  }
});

module.exports = router;
