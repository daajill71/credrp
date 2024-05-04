// Importing express module and creating a router instance
const express = require('express');
const router = express.Router();

// Importing the Client model
const Client = require('../models/Client');

// Route to get client information by _id ('/:id')
router.get('/:_id', async (req, res) => {
  try {
    // Extracting _id from URL parameters
    const { _id } = req.params; // Capture the _id parameter correctly

    // Querying the database to find a client by _id
    const client = await Client.findOne({ _id }); // Query by _id without renaming it

    // Handling case where client is not found
    if (!client) {
      console.error('Client not found for _id:', _id); // Use _id instead of id
      return res.status(404).json({ error: 'Client not found' });
    }

    // Sending the client information as JSON response
    console.log('Client information retrieved successfully for _id:', _id); // Use _id instead of id
    res.json(client);
  } catch (err) {
    // Handling errors that occur during the process
    console.error('Error while fetching client information:', err);
    res.status(500).json({ error: 'An error occurred while fetching client information.' });
  }
});

// Exporting the router for use in other modules
module.exports = router;
