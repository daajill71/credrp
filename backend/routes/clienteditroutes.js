const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Client = require('../models/Client');

// PUT route to update a client by ID
router.put('/:id', async (req, res) => {
  try {
    const clientId = req.params.id; // Using req.params.id to get the client ID
    const updatedClientData = req.body;

    // Find the client by _id and update it
    const updatedClient = await Client.findByIdAndUpdate(clientId, updatedClientData, { new: true });

    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    return res.status(200).json({ message: 'Client updated successfully', updatedClient });
  } catch (error) {
    console.error('Error updating client:', error);
    return res.status(500).json({ error: 'An error occurred while updating the client' });
  }
});

module.exports = router;
