// backend/routes/disputelist.js

const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute'); // Import your MongoDB model for disputes



// Route to fetch data
router.get('/fetch-data', async (req, res) => {
  try {
    // Log before retrieving data
    console.log('Fetching data from MongoDB');

    // Fetch data from MongoDB using the model
    const data = await YourModel.find();

    // Log after data retrieval
    console.log('Data retrieved successfully');

    // Send the data as a JSON response
    res.json(data);
  } catch (error) {
    // Handle errors and log them
    console.error('Error retrieving data from MongoDB:', error);

    // Send an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;





