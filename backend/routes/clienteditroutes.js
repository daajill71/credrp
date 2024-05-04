const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// PUT route to update a client by ID
router.put('/:_id', async (req, res) => {
  try {
    const updatedClientData = req.body;
    const _id = req.params._id;

    const updatedClient = await Client.findByIdAndUpdate(_id, updatedClientData, { new: true });

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
