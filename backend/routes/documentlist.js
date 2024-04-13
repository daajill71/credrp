const express = require('express');
const router = express.Router();
const Document = require('../models/Document'); // Import your Document model

// Route to get a list of documents
router.get('/list', async (req, res) => {
  try {
    // Log before retrieving data
    console.log('Fetching documents...');

    // Retrieve documents from the database
    const documents = await Document.find();

    // Log documents before sending them as a response
    console.log('Documents retrieved successfully:', documents);

    // Send documents as a JSON response
    res.json(documents);
  } catch (err) {
    // Handle errors and log them
    console.error('Error while fetching documents:', err);

    // Send an error response
    res.status(500).json({ error: 'An error occurred while fetching documents.' });
  }
});

module.exports = router;
