const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');

// Define a route to handle the form submission
router.post('/', async (req, res) => {
  try {
    const { clientName, description } = req.body;

    // Ensure that the required fields are provided
    if (!clientName || !description) {
      return res.status(400).json({ error: 'Client name and description are required fields' });
    }

    // Create a new dispute document using the Mongoose model
    const newDispute = new Dispute({
      clientName,
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
