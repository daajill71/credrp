const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
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
  //emailAddress: {
    //type: String,
    //required: true,
    //unique: true,
    //sparse: true, // Add sparse option to allow multiple documents with null email
  //},
  phoneNumber: {
    type: String,
    required: true,
  },
  socialSecurityNumber: {
    type: String,
    required: true,
  },
  accountStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active',
  },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
