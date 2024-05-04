const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const CreditReport = require('../models/CreditReport');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is a PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Only PDF files are allowed.'), false);
    }
  }
});

// Function to analyze the text extracted from a PDF file
function analyzePDFText(text) {
  const keywords = ['delinquent', 'latepayment', 'charge-off'];
  const negativeAccounts = [];

  // Split the text into lines
  const lines = text.split('\n');

  // Iterate through each line of the text
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim(); // Trim the whitespace from the line

    // Check if the line contains any of the keywords
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      if (regex.test(line)) {
        // Extract the account details
        const accountDetails = line.split('-').map(item => item.trim());

        // Push the negative account details to the result
        negativeAccounts.push({
          keyword: keyword,
          account: {
            name: accountDetails[0],
            number: accountDetails[1], // Assuming account number comes after account name
            balance: accountDetails[2] // Assuming balance comes after account number
          }
        });
        break; // Move to the next line after finding a match
      }
    }
  }

  return negativeAccounts;
}

// Route to analyze the uploaded credit report
router.post('/:_id', upload.single('creditReport'), async (req, res) => {
  try {
    const { _id } = req.params;
    const fileBuffer = req.file.buffer;

    // Parse the PDF file
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    // Log the parsed text to the console
    console.log('Parsed Text:', text);

    // Analyze the parsed text to identify negative and derogatory accounts
    const negativeAccounts = analyzePDFText(text);

    // Logging the analysis results to console
    console.log('Analysis Result:', negativeAccounts);

    // Save the analysis result to the database
    const creditReport = new CreditReport({
      client: _id,
      analysisResult: negativeAccounts // Send the array of objects containing both keyword and account
    });
    await creditReport.save();

    // Send the analysis result back to the frontend
    res.status(200).json(negativeAccounts);
  } catch (error) {
    console.error('Error analyzing credit report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
