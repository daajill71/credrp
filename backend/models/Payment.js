const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Reference to the Client schema (if you have one)
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Other'],
    required: true,
  },
  // Add more fields as needed
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
