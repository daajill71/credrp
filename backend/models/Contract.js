const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Reference to the Client schema (if you have one)
    required: true,
  },
  contractTitle: {
    type: String,
    required: true,
  },
  contractText: {
    type: String,
    required: true,
  },
  signingDate: {
    type: Date,
    default: Date.now,
  },
  // Add more fields as needed
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
