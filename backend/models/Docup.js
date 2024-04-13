const mongoose = require('mongoose');

// Define the Docup schema
const docupSchema = new mongoose.Schema({

  //clientId: {
    //type: String, // The ID of the client associated with this document
    //required: true,
    //unique: true,
  //},
  
  docupType: {
    type: String, // E.g., "Driver's License", "Proof of Current Mailing Address", "Social Security Card", or any other document type
    required: true,
  },
 docupName: {
    type: String, // The name of the uploaded document file
    required: true,
  },
  
  // You can add more fields if needed, such as timestamps, user who uploaded it, etc.
});

// Create the Docup model
const Docup = mongoose.model('Docup', docupSchema);

module.exports = Docup;
