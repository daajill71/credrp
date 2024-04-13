const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Client = require('../models/Client');

router.delete('/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Check if the provided clientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }

    // Find the client by _id and delete it
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    return res.status(200).json({ message: 'Client deleted successfully', deletedClient });
  } catch (error) {
    console.error('Error deleting client:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the client' });
  }
});

module.exports = router;
