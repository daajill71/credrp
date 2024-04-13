const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  // Remove the clientId field
  // Other fields...
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

// Remove the toJSON option to keep the default _id field
// clientSchema.set('toJSON', {
//   virtuals: true,
//   transform: (doc, ret) => {
//     delete ret._id;
//     delete ret.__v;
//   },
// });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
