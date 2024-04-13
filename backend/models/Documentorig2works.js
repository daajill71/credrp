// Import the mongoose library
const mongoose = require('mongoose');

// Define a new mongoose schema for the Document model
const documentSchema = new mongoose.Schema({
  // Define a field for storing the client ID, referencing the 'Client' model
  clientId: {
    type: String, //mongoose.Schema.Types.ObjectId,
    //ref: 'Client', // Reference to the Client model
    required: true, // It is a required field
    unique: true,
  },
  
  // Define a subdocument for the driver's license
  driverLicense: {
    documentName: {
      type: String,
      required: true, // It is a required field
    },
    fileBuffer: {
      type: Buffer,
      required: true, // It is a required field
    },
  },

  // Define a subdocument for the social security card
  socialSecurityCard: {
    documentName: {
      type: String,
      required: true, // It is a required field
    },
    fileBuffer: {
      type: Buffer,
      required: true, // It is a required field
    },
  },

  // Define a subdocument for the proof of mailing address
  proofOfMailingAddress: {
    documentName: {
      type: String,
      required: true, // It is a required field
    },
    fileBuffer: {
      type: Buffer,
      required: true, // It is a required field
    },
  },

  // Define a subdocument for other documents
  otherDocument: {
    documentName: {
      type: String,
    },
    fileBuffer: {
      type: Buffer,
    },
  },
});

// Create a mongoose model named 'Document' based on the defined schema
const Document = mongoose.model('Document', documentSchema);

// Export the 'Document' model for use in other parts of the application
module.exports = Document;

