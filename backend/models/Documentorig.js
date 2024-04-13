const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Reference to the Client schema (if you have one)
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  documentName: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  driverLicense: {
    type: String, // You can adjust the data type as needed (e.g., file URL or document details)
    required: true, // This makes it required
  },
  socialSecurityCard: {
    type: String,
    required: true, // This makes it required
  },
  proofOfCurrentMailingAddress: {
    type: String,
    required: true, // This makes it required
  },
  otherDocuments: [
    {
      type: String, // You can adjust the data type as needed
    },
  ],
  // Add more fields as needed
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
