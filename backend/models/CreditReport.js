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
      name: String,
      number: String,
      balance: String
    }
  }]
});

const CreditReport = mongoose.model('CreditReport', creditReportSchema);

module.exports = CreditReport;
