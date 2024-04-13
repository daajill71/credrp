const express = require('express');
const router = express.Router();
const Client = require('../models/Client'); // Assuming you have a Client model

// Route to fetch client name based on client ID
router.get('/:id/name', async (req, res) => {
  try {
    const { id } = req.params;
    // Log before retrieving client name by id
    console.log('Fetching client name by ID ...');

    const client = await Client.findById(id);
    if (!client) {
      // Log client not found
      console.log('Client not found');
      return res.status(404).json({ error: 'Client not found' });
    }
    const { firstName, lastName } = client;

    // Log client before sending them as a response
    console.log('Client name retrieved successfully:', client);

    // Send client name as a JSON response
    res.json({ firstName, lastName });
  } catch (error) {
    console.error('Error fetching client name:', error);
    res.status(500).json({ error: 'An error occurred while fetching client name' });
  }
});

module.exports = router;
