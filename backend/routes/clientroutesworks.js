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

    // Validate data (you can use a library like Joi for this)
    //if (!firstName || !lastName || !emailAddress) {
      //return res.status(400).json({ error: 'Missing required fields' });
   // }

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
    return res.status(201).json({
      message: 'Client Information submitted successfully',
      client: savedClient,
    });
  } catch (err) {
    console.error('Error saving client information:', err);
    return res.status(500).json({ error: 'An error occurred while saving client information to the database' });
  }
});

module.exports = router;
