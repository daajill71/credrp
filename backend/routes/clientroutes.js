const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Route to add a new client. ('/add-client')
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      //emailAddress,
      phoneNumber,
      socialSecurityNumber,
    } = req.body;

    // Remove the clientId field from the request body

    // Validate data (you can use a library like Joi for this)
    //if (!firstName || !lastName || !emailAddress) {
    //return res.status(400).json({ error: 'Missing required fields' });
    //}

    const newClient = new Client({
      firstName,
      middleName,
      lastName,
      currentMailingAddress,
      dateOfBirth,
      //emailAddress,
      phoneNumber,
      socialSecurityNumber,
    });

    const savedClient = await newClient.save();

    // Include _id in the response
    return res.status(201).json({
      message: 'Client Information submitted successfully',
      client: {
        ...savedClient._doc,
        _id: savedClient._id // Include _id field
      },
    });
  } catch (err) {
    console.error('Error saving client information:', err);
    return res.status(500).json({ error: 'An error occurred while saving client information to the database' });
  }
});

module.exports = router;
