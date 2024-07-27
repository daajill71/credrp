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

  // Split the text into sections based on the delimiter 'Accounts:'
  const sections = text.split('Accounts:');

  // Extract account details from each section
  sections.forEach((section, index) => {
    // Skip the first section as it contains header information
    if (index === 0) return;

    // Extract account details from the section
    const lines = section.trim().split('\n');
    const accountDetails = {};
    let accountName = ''; // Initialize accountName variable
    let foundFirstDetail = false; // Flag to track if the first detail has been found

    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      const trimmedKey = key.trim();
      const trimmedValue = valueParts.join(':').trim();

      if (!foundFirstDetail) { // Check if the first detail has been found
        // Set the first non-empty value encountered as the account name
        if (trimmedValue) {
          accountName = trimmedValue;
          foundFirstDetail = true;
          console.log('Account Name:', accountName);
        }
      } else { // For subsequent details, process as before
        // Check if the value matches any of the keywords
        if (keywords.includes(trimmedValue.toLowerCase())) {
          // If it's a keyword, set the keyword variable
          accountDetails[trimmedKey] = trimmedValue;
        } else {
          // If not a keyword, it's likely part of account details
          accountDetails[trimmedKey] = trimmedValue;
        }
      }

      // Log account details
      console.log('Account Detail:', trimmedKey, trimmedValue);
    });

    // If an account name was found, add the account to negativeAccounts
    if (accountName) {
      negativeAccounts.push({ accountName, ...accountDetails });
    }
  });

  console.log('Negative Accounts:', negativeAccounts); // Log the negative accounts found

  return negativeAccounts;
}
function analyzePDFText(text) {
  const keywords = ['delinquent', 'latepayment', 'charge-off'];
  const negativeAccounts = [];

  // Split the text into sections based on the delimiter 'Accounts:'
  const sections = text.split('Accounts:');

  // Extract account details from each section
  sections.forEach((section, index) => {
    // Skip the first section as it contains header information
    if (index === 0) return;

    // Extract account details from the section
    const lines = section.trim().split('\n');
    const accountDetails = {};
    let accountName = ''; // Initialize accountName variable
    let foundFirstDetail = false; // Flag to track if the first detail has been found

    // Loop through each line in the section
    lines.forEach(line => {
      // If a line does not contain a colon ":" and it's not an empty line, treat it as the account name
      if (!line.includes(':') && line.trim() !== '') {
        accountName = line.trim();
        console.log('First Account Detail (Account Name):', accountName);
        foundFirstDetail = true; // Set the flag to true
        return; // Exit the loop
      }

      // If the account name has already been found, process the line as before
      if (foundFirstDetail) {
        // Extract key and value parts
        const [key, ...valueParts] = line.split(':');
        const trimmedKey = key.trim();
        const trimmedValue = valueParts.join(':').trim();

        // Check if the value matches any of the keywords
        if (keywords.includes(trimmedValue.toLowerCase())) {
          // If it's a keyword, set the keyword variable
          accountDetails[trimmedKey] = trimmedValue;
        } else {
          // If not a keyword, it's likely part of account details
          accountDetails[trimmedKey] = trimmedValue;
        }

        // Log account details
        console.log('Account Detail:', trimmedKey, trimmedValue);
      }
    });

    // If an account name was found, add the account to negativeAccounts
    if (accountName) {
      negativeAccounts.push({ accountName, ...accountDetails });
    }
  });

  console.log('Negative Accounts:', negativeAccounts); // Log the negative accounts found

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

    // Log the account name if available
    if (negativeAccounts.length > 0) {
      console.log('Account Name from Analysis Result:', negativeAccounts[0].accountName);
    } else {
      console.log('No negative accounts found.');
    }

    // Save the analysis result to the database
    const creditReport = new CreditReport({
      client: _id,
      analysisResult: negativeAccounts // Send the object containing analysis results
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

