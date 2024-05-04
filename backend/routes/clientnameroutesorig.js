const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Route to fetch client first name based on client ID
router.get('/:id/firstName', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching client first name by ID ...');
    const client = await Client.findById(id);
    if (!client) {
      console.log('Client not found');
      return res.status(404).json({ error: 'Client not found' });
    }
    console.log('Client first name retrieved successfully:', client.firstName);
    res.json({ firstName: client.firstName });
  } catch (error) {
    console.error('Error fetching client first name:', error);
    res.status(500).json({ error: 'An error occurred while fetching client first name' });
  }
});

// Route to fetch client last name based on client ID
router.get('/:id/lastName', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching client last name by ID ...');
    const client = await Client.findById(id);
    if (!client) {
      console.log('Client not found');
      return res.status(404).json({ error: 'Client not found' });
    }
    console.log('Client last name retrieved successfully:', client.lastName);
    res.json({ lastName: client.lastName });
  } catch (error) {
    console.error('Error fetching client last name:', error);
    res.status(500).json({ error: 'An error occurred while fetching client last name' });
  }
});

module.exports = router;
