const mongoose = require('mongoose');

const creditReportSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  analysisResult: [{
    keyword: String,
    account: {
      name: String, // Assuming this is the account name
      accountName: String,
      number: String,
      balance: String
    },
    // Add fields for inquiries
    inquiries: [{
      Creditor: String,
      'Types of Business': String,
      'Date of Inquiry': String,
      'Credit Bureau': String
    }]
  }]
});

const CreditReport = mongoose.model('CreditReport', creditReportSchema);

module.exports = CreditReport;
