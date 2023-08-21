const Dispute = require('../models/Dispute');

// Example: Create a new dispute
exports.createDispute = async (req, res) => {
  try {
    const { clientName, description } = req.body;
    const newDispute = new Dispute({ clientName, description });
    await newDispute.save();
    res.status(201).json(newDispute);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
