// Importing express module and creating a router instance
const express = require('express');
const router = express.Router();

// Importing the Client model
const Client = require('../models/Client');

// Route to fetch client first name based on client ID
router.get('/:_id/firstName', async (req, res) => {
  try {
    // Extracting _id from URL parameters
    const { _id } = req.params;
    console.log('Fetching client first name by ID ...');

    // Querying the database to find a client by _id
    const client = await Client.findById(_id);
    if (!client) {
      // Handling case where client is not found
      console.log('Client not found');
      return res.status(404).json({ error: 'Client not found' });
    }

    // Sending the first name of the client as JSON response
    console.log('Client first name retrieved successfully:', client.firstName);
    res.json({ firstName: client.firstName });
  } catch (error) {
    // Handling errors that occur during the process
    console.error('Error fetching client first name:', error);
    res.status(500).json({ error: 'An error occurred while fetching client first name' });
  }
});

// Route to fetch client last name based on client ID
router.get('/:_id/lastName', async (req, res) => {
  try {
    // Extracting _id from URL parameters
    const { _id } = req.params;
    console.log('Fetching client last name by ID ...');

    // Querying the database to find a client by _id
    const client = await Client.findById(_id);
    if (!client) {
      // Handling case where client is not found
      console.log('Client not found');
      return res.status(404).json({ error: 'Client not found' });
    }

    // Sending the last name of the client as JSON response
    console.log('Client last name retrieved successfully:', client.lastName);
    res.json({ lastName: client.lastName });
  } catch (error) {
    // Handling errors that occur during the process
    console.error('Error fetching client last name:', error);
    res.status(500).json({ error: 'An error occurred while fetching client last name' });
  }
});

// Exporting the router for use in other modules
module.exports = router;
