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

  // Function to process the inquiry block
  // Function to process the inquiry block
function processInquiryBlock(lines) {
  if (lines.length === 0) return;

  const inquiries = [];
  let currentInquiry = '';

  // Loop through the lines to group them into individual inquiries
  lines.forEach(line => {
    if (line.includes('Inquired on')) {
      // Start a new inquiry when encountering "Inquired on"
      if (currentInquiry) {
        inquiries.push(currentInquiry.trim());
      }
      currentInquiry = line.trim();
    } else {
      // Continue the current inquiry
      currentInquiry += ` ${line.trim()}`;
    }
  });

  // Add the last inquiry
  if (currentInquiry) {
    inquiries.push(currentInquiry.trim());
  }

  // Process each inquiry
  inquiries.forEach((inquiry, index) => {
    console.log(`Processed inquiry ${index + 1}:`, inquiry);

    // Extract the relevant parts using regex or string matching
    const creditorMatch = inquiry.match(/^[^\/]+/); // Match everything before the first slash or space
    const dateMatch = inquiry.match(/Inquired on ([\w\s\d,]+)/);
    const businessTypeMatch = inquiry.match(/Business Type: ([\w\s,]+)/);
    const scheduledDateMatch = inquiry.match(/continue on record until ([\w\s\d,]+)/);

    const creditor = creditorMatch ? creditorMatch[0].trim() : '';
    const dateOnInquiry = dateMatch ? dateMatch[1].trim() : '';
    const businessType = businessTypeMatch ? businessTypeMatch[1].trim() : '';
    const scheduledDate = scheduledDateMatch ? scheduledDateMatch[1].trim() : '';

    // Log the extracted parts for debugging
    console.log(`Creditor: ${creditor}`);
    console.log(`Date of Inquiry: ${dateOnInquiry}`);
    console.log(`Business Type: ${businessType}`);
    console.log(`Scheduled Date: ${scheduledDate}`);

    // Construct the inquiry object
    const inquiryObj = {
      Creditor: creditor,
      'Date of Inquiry': dateOnInquiry,
      'Business Type': businessType,
      'Scheduled to Continue Until': scheduledDate
    };

    // Push the inquiry object to the categories
    categories.inquiries.push(inquiryObj);
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
