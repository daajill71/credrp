const mongoose = require('mongoose');

const creditReportSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Assuming you have a Client model
    required: true
  },
  analysisResult: [{
    type: String
  }]
});

const CreditReport = mongoose.model('CreditReport', creditReportSchema);

module.exports = CreditReport;
