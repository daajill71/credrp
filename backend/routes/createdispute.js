const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');

// Create a new dispute
router.post('/', async (req, res) => {
  try {
    const { clientName, description } = req.body;
    const newDispute = new Dispute({ clientName, description });
    await newDispute.save();
    res.status(201).json(newDispute);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
