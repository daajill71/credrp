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

    // Log the disputes before sending them as a response
    console.log('Disputes:', disputes);

    // Send the data as a JSON response
    res.json(disputes);
  } catch (error) {
    // Handle errors and log them
    console.error('Error retrieving data from MongoDB:', error);

    // Send an error response
    res.status(500).json({ error: 'Internal Server Error. Error retrieving data from MongoDB' });
  }
});

module.exports = router;
