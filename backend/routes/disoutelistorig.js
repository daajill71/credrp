const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute'); // Import your MongoDB model for disputes

// Route to fetch data
router.get('/', async (req, res) => {
  try {
    // Log before retrieving data
    console.log('Fetching data from MongoDB');

    // Fetch data from MongoDB using the Dispute model
    const disputes = await Dispute.find();

    // Log after data retrieval
    console.log('Data retrieved successfully');

    // Send the data as a JSON response
    res.json(disputes);
  } catch (error) {
    // Handle errors and log them
    console.error('Error retrieving data from MongoDB:', error);

    // Send an error response
    res.status(500).json({ error: 'Internal Server Error. Error retrieving data from MongoDB' });
  }
});

// Additional route to fetch dispute list
router.get('/disputelist', async (req, res) => {
  try {
    // Log before retrieving dispute list data
    console.log('Fetching dispute list data from MongoDB');

    // Fetch dispute list data from MongoDB using the Dispute model and find method
    const disputeList = await Dispute.find();

    // Log after dispute list data retrieval
    console.log('Dispute list data retrieved successfully');

    // Send the dispute list data as a JSON response
    res.json(disputeList);
  } catch (error) {
    // Handle errors and log them
    console.error('Error retrieving dispute list data from MongoDB:', error);

    // Send an error response
    res.status(500).json({ error: 'Internal Server Error. Error retrieving dispute list data from MongoDB' });
  }
});

module.exports = router;
