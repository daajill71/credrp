const mongoose = require('mongoose');

// Define schema for individual accounts
const accountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  accountDetails: {
    "Account #": { type: String },
    "Balance Owed": { type: String },
    "Payment Status": { type: String }
  }
});

// Define schema for individual inquiries
const inquirySchema = new mongoose.Schema({
  Creditor: { type: String, required: true },
  "Date On Inquiry": { type: String, required: true },
  "Credit Bureau": { type: String, required: true }
});

// Define schema for the analysis result
const analysisResultSchema = new mongoose.Schema({
  delinquent: [accountSchema], // Array of accounts categorized as delinquent
  latepayment: [accountSchema], // Array of accounts categorized as late payment
  chargeOff: [accountSchema], // Array of accounts categorized as charge-off
  inquiries: [inquirySchema] // Array of inquiries
});

// Main credit report schema
const creditReportSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  analysisResult: analysisResultSchema // Embed the analysis result schema
});

const CreditReport = mongoose.model('CreditReport', creditReportSchema);

module.exports = CreditReport;
