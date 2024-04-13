const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  clientID: { type: String, required: true }, // Assuming clientID is a string; adjust the type accordingly
  //clientName: { type: String, required: true },
  description: { type: String, required: true },
  
  // Other fields
  // Other fields
});

const Dispute = mongoose.model('Dispute', disputeSchema);

module.exports = Dispute;
