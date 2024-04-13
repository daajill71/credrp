const express = require('express');
const router = express.Router();
const Docup = require('../models/Docup'); // Import your Docup model

// Route to get a list of documents
router.get('/list', async (req, res) => {
  try {
    // Log before retrieving data
    console.log('Fetching documents...');

    // Retrieve documents from the database
    const docups = await Docup.find();

    // Log documents before sending them as a response
    console.log('Documents retrieved successfully:', docups);

    // Send documents as a JSON response
    res.json(docups);
  } catch (err) {
    // Handle errors and log them
    console.error('Error while fetching documents:', err);

    // Send an error response
    res.status(500).json({ error: 'An error occurred while fetching documents.' });
  }
});

module.exports = router;
