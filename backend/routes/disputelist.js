// backend/routes/disputelist.js

const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute'); // Import your MongoDB model for disputes

// Define a route to get a list of disputes
router.get('/', async (req, res) => {
  try {
    // Fetch the list of disputes from the database
    const disputes = await Dispute.find({}, 'clientName description');

    // Respond with the list of disputes
    return res.status(200).json(disputes);
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return res.status(500).json({ message: 'Error fetching disputes' });
  }
});

module.exports = router;
