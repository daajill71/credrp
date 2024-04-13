// clientRoutes.js
const express = require('express');
const router = express.Router();
const Client = require('../models/Client'); // Import your Client model

// Route to add a new client. ('/add-client')
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, currentMailingAddress, dateOfBirth, email, phoneNumber, socialSecurityNumber } = req.body;
    const newClient = new Client({
      firstName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      email,
      phoneNumber,
      socialSecurityNumber,
    });
    const savedClient = await newClient.save();
    res.json(savedClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get client information.('/get-client/:clientId'
router.get('/', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
