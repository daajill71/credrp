const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  description: { type: String, required: true },
  // Other fields
});

const Dispute = mongoose.model('Dispute', disputeSchema);

module.exports = Dispute;
