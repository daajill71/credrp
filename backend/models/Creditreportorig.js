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
      //name: String, // Assuming this is the account name
      accountName: String,
      Accountnumber: String,
      BalanceOwed: String
      

    },
    inquiries: [{
      Creditor: String,
      'Date on Inquiry': String,
      //'Business Type': String,
      //'Scheduled to Continue Until': String
      //'Types of Business': String,
      'Credit Bureau': String
    }]
    // Add fields for inquiries
    
      
   
  }]
});

const CreditReport = mongoose.model('CreditReport', creditReportSchema);

module.exports = CreditReport;
