const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  currentMailingAddress: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  driverLicenseCopy: {
    type: String, // You can store the file path or URL to the uploaded file
  },
  currentMailingAddressCopy: {
    type: String, // File path or URL
  },
  socialSecurityCardCopy: {
    type: String, // File path or URL
  },
  contracts: [
    {
      contractName: {
        type: String,
        required: true,
      },
      // Add more contract-related fields here
    },
  ],
  accountStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active',
  },
  // Add more fields as needed
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
