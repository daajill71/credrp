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

// Function to analyze the text extracted from the PDF
function analyzePDFText(text) {
  // Keywords to identify types of accounts
  const keywords = ['delinquent', 'latepayment', 'charge-off'];

  // Object to store categorized accounts and inquiries
  const categories = {
    delinquent: [],
    latepayment: [],
    chargeOff: [],
    inquiries: []
  };

  // Log the parsed text to the console
  console.log('Parsed Text:', text);

  // Extract accounts and inquiries sections from the text
  const accountsSection = text.split('Inquiries')[0].split('Accounts:')[1]?.trim();
  const inquiriesSection = text.split('Inquiries')[1]?.trim();

  // Log the sections to verify their content
  console.log('Accounts Section:', accountsSection);
  console.log('Inquiries Section:', inquiriesSection);

  // Process accounts section if it exists
  if (accountsSection) {
    console.log('Accounts Section:', accountsSection);
    const accountBlocks = accountsSection.split('\n\n');
    accountBlocks.forEach(block => processAccountBlock(block.trim()));
  }

  // Process inquiries section if it exists
  if (inquiriesSection) {
    console.log('Inquiries Section:', inquiriesSection);
    const inquiryLines = inquiriesSection.split('\n').filter(line => line.trim() !== '');

    // Log the inquiry lines
    console.log('Inquiry Lines:', inquiryLines);

    // Remove the header line
    if (inquiryLines.length > 0) {
      inquiryLines.shift();
    }

    // Process each inquiry line
    processInquiryBlock(inquiryLines);
  }

  // Function to process each block of account information
  function processAccountBlock(block) {
    const lines = block.split('\n');
    let accountDetails = {};
    let accountName = '';

    lines.forEach(line => {
      if (line.trim() === '' || line.trim().startsWith('Inquiries')) {
        return;
      }

      if (!line.includes(':') && line.trim() !== '') {
        // If the current line is a new account name
        if (accountName && Object.keys(accountDetails).length > 0) {
          categorizeAccount({ accountName, ...accountDetails });
        }

        accountName = line.trim();
        accountDetails = {};
        console.log('Detected Account Name:', accountName);
      } else {
        // If the current line is an account detail
        const [key, ...valueParts] = line.split(':');
        const trimmedKey = key.trim();
        const trimmedValue = valueParts.join(':').trim();
        accountDetails[trimmedKey] = trimmedValue;
      }
    });

    // Categorize the last account in the block
    if (accountName && Object.keys(accountDetails).length > 0) {
      categorizeAccount({ accountName, ...accountDetails });
    }
  }

  // Function to process each line of inquiry information
  function processInquiryBlock(lines) {
    const datePatterns = [/\b\d{4}-\d{2}-\d{2}\b/, /\b\d{2}\/\d{2}\/\d{4}\b/];

    lines.forEach((line, index) => {
        console.log(`Original inquiry line ${index + 1}:`, line);

        // Normalize line to ensure correct splitting
        let normalizedLine = line
            .replace(/([A-Za-z])(?=\d)/g, '$1 ') // Add space between letters and numbers
            .replace(/(\d)(?=[A-Za-z])/g, '$1 ') // Add space between numbers and letters
            .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, ' $1/$2/$3 ') // Add space around MM/DD/YYYY
            .replace(/(\d{4})-(\d{2})-(\d{2})/g, ' $1-$2-$3 ')       // Add space around YYYY-MM-DD
            .replace(/\t+/g, ' ') // Replace tabs with single spaces
            .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
            .trim();

        console.log(`Normalized Line ${index + 1}:`, normalizedLine);

        // Split into parts
        const parts = normalizedLine.split(' ').map(part => part.trim()).filter(part => part);
        console.log(`Split parts of line ${index + 1}:`, parts);

        // Validate parts length
        if (parts.length < 3) {
            console.log(`Line does not have enough parts to create an inquiry:`, parts);
            return; // Skip this line
        }

        // Extract inquiry details
        const inquiry = {
            Creditor: parts[0],
            //'Type of Business': parts[1],
            'Date On Inquiry': parts[1],
            'Credit Bureau': parts[2]
        };

        // Add inquiry to categories
        categories.inquiries.push(inquiry);
        console.log('Inquiry added:', inquiry);
    });
}

  

  // Function to categorize an account based on keywords
  function categorizeAccount(account) {
    for (const keyword of keywords) {
      for (const key in account) {
        if (account[key].toLowerCase() === keyword) {
          if (keyword === 'delinquent') {
            categories.delinquent.push(account);
          } else if (keyword === 'latepayment') {
            categories.latepayment.push(account);
          } else if (keyword === 'charge-off') {
            categories.chargeOff.push(account);
          }
          return;
        }
      }
    }
  }

  // Log and return the categories
  console.log('Categories:', categories);
  return categories;
}

// Route to analyze the uploaded credit report
router.post('/:_id', upload.single('creditReport'), async (req, res) => {
  try {
    const { _id } = req.params;
    const fileBuffer = req.file.buffer;

    // Parse the PDF file
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    // Analyze the parsed text to identify negative and derogatory accounts
    const categorizedAccounts = analyzePDFText(text);

    // Logging the analysis results to console
    console.log('Analysis Result:', categorizedAccounts);

    // Save the analysis result to the database
    const creditReport = new CreditReport({
      client: _id,
      analysisResult: categorizedAccounts // Send the object containing analysis results
    });
    await creditReport.save();

    // Send the analysis result back to the frontend
    res.status(200).json(categorizedAccounts);
  } catch (error) {
    console.error('Error analyzing credit report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
