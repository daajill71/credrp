const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Route to get client information by clientId ('/clientId')
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findOne({ clientId });

    if (!client) {
      console.error('Client not found for clientId:', clientId);
      return res.status(404).json({ error: 'Client not found' });
    }

    console.log('Client information retrieved successfully for clientId:', clientId);
    res.json(client);
  } catch (err) {
    console.error('Error while fetching client information:', err);
    res.status(500).json({ error: 'An error occurred while fetching client information.' });
  }
});

module.exports = router;
