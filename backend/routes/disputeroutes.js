const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');

// Define a route to handle the form submission
router.post('/:clientID', async (req, res) => {
  try {
    const { description } = req.body;
    const { clientID } = req.params;

    // Ensure that the required fields are provided
    if (!description) {
      return res.status(400).json({ error: 'Client description is a required fields' });
    }

    // Create a new dispute document using the Mongoose model
    const newDispute = new Dispute({
      clientID, // Include clientID in the dispute document
     // clientName,
      description,
      // Other fields if applicable
    });

    // Save the document to the database using await
    const savedDispute = await newDispute.save();

    res.status(201).json({ message: 'Dispute submitted successfully', dispute: savedDispute });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving dispute to the database' });
  }
});

module.exports = router;
