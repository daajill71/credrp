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
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Only PDF files are allowed.'), false);
    }
  }
});

// Function to normalize the parsed text
function normalizeText(text) {
  console.log('Raw Extracted Text:', text); // Log the raw text before normalization
  const normalized = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .replace(/:/g, ': ')
    .trim();
  console.log('Normalized Text:', normalized); // Log the normalized text
  return normalized;
}

// Main function to analyze the text
function analyzePDFText(text) {
  const categories = { delinquent: [], latepayment: [], chargeOff: [], collection: [], inquiries: [] };

  const normalizedText = normalizeText(text);

  const startMarker = 'Revolving Accounts: Accountswithanopen-endterm';
  const midMarker = 'Installment Accounts: Accountscomprisedoffixedtermswithregularpayments';
  const endMarker = 'Inquiries';

  console.log(`Start Marker Found: ${normalizedText.includes(startMarker)}`);
  console.log(`Mid Marker Found: ${normalizedText.includes(midMarker)}`);
  console.log(`End Marker Found: ${normalizedText.includes(endMarker)}`);

  const accountsSection = normalizedText.includes(startMarker) && normalizedText.includes(endMarker)
    ? normalizedText.split(startMarker)[1]?.split(endMarker)[0]?.trim()
    : '';

  if (!accountsSection) {
    console.error('Accounts section could not be extracted.');
  } else {
    const accountBlocks = [];
    let currentBlock = [];

    accountsSection.split('\n').forEach(line => {
      const trimmedLine = line.trim();

      if (trimmedLine === '') return;

      if (/^[A-Z\s]+$/.test(trimmedLine) && !trimmedLine.startsWith('Inquiries')) {
        if (currentBlock.length > 0) {
          accountBlocks.push(currentBlock.join('\n'));
          currentBlock = [];
        }
      }

      currentBlock.push(trimmedLine);
    });

    if (currentBlock.length > 0) {
      accountBlocks.push(currentBlock.join('\n'));
    }

    console.log('Grouped Account Blocks:', accountBlocks);

    accountBlocks.forEach((block) => processAccountBlock(block, categories));
  }

  if (normalizedText.includes(endMarker)) {
    const inquirySection = normalizedText.split(endMarker)[1]?.trim();
    const inquiryLines = inquirySection?.split('\n').filter(line => line.trim() !== '') || [];
    console.log('Extracted Inquiry Lines:', inquiryLines);

    processInquiryBlock(inquiryLines, categories);
  }

  console.log('Categories After All Processing:', categories);
  return categories;
}

// Function to process each block of account information
function processAccountBlock(block, categories) {
  const lines = block.split('\n');
  let accountDetails = {};
  let accountName = '';

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (trimmedLine === '') return;

    const excludedLines = [
      'Installment Accounts: Accountscomprisedoffixedtermswithregularpayments',
      'Revolving Accounts: Accountswithanopen-endterm'
    ];
    if (excludedLines.includes(trimmedLine)) {
      console.log(`Skipping line: ${trimmedLine}`);
      return;
    }

    if (/^[A-Z\s]+$/.test(trimmedLine) && !trimmedLine.startsWith('Inquiries')) {
      if (accountName && Object.keys(accountDetails).length > 0) {
        console.log('Finalizing Account:', { accountName, accountDetails });
        categorizeAccount({ accountName, ...accountDetails }, categories);
      }

      accountName = trimmedLine;
      accountDetails = {};
      console.log('Detected Account Name:', accountName);
    } else if (/^Account\s?#\d+\*+$/.test(trimmedLine)) {
      const [key, value] = trimmedLine.split('#');
      accountDetails[`${key.trim()}#`] = value.trim();
      console.log(`Extracted Account Number: ${key.trim()}# = ${value.trim()}`);
    } else if (trimmedLine.includes(':')) {
      const [key, ...valueParts] = trimmedLine.split(':');
      const trimmedKey = key.trim();
      const trimmedValue = valueParts.join(':').trim();
      accountDetails[trimmedKey] = trimmedValue;
      console.log(`Extracted Key-Value Pair: ${trimmedKey} = ${trimmedValue}`);
    }
  });

  if (accountName && Object.keys(accountDetails).length > 0) {
    console.log('Finalizing Last Account in Block:', { accountName, accountDetails });
    categorizeAccount({ accountName, ...accountDetails }, categories);
  }
}

// Function to categorize an account based on keywords
function categorizeAccount(account, categories) {
  console.log('Categorizing Account:', account);

  const keywords = ['delinquent', 'latepayment', 'charge-off', 'collection'];
  for (const keyword of keywords) {
    for (const key in account) {
      if (account[key]?.toLowerCase() === keyword) {
        console.log(`Keyword Match Found: ${keyword}`);
        if (keyword === 'delinquent') {
          categories.delinquent.push(account);
        } else if (keyword === 'latepayment') {
          categories.latepayment.push(account);
        } else if (keyword === 'charge-off') {
          categories.chargeOff.push(account);
        } else if (keyword === 'collection') {
          categories.collection.push(account);
        }
        return;
      }
    }
  }

  console.log('Account Not Categorized:', account);
}

// Function to process inquiries
function processInquiryBlock(lines, categories) {
  lines.forEach((line, index) => {
    console.log(`Original Inquiry Line ${index + 1}:`, line);

    // Skip header line
    if (line.toLowerCase().includes('creditor name') && line.toLowerCase().includes('credit bureau')) {
      console.log('Skipping Header Line:', line);
      return;
    }

    const parts = line.split(/\s+/); // Split by whitespace
    console.log(`Split Parts of Line ${index + 1}:`, parts);

    if (parts.length >= 3) {
      const inquiry = {
        Creditor: parts.slice(0, parts.length - 2).join(' '), // Multi-word creditor name
        'Date On Inquiry': parts[parts.length - 2],          // Date of inquiry
        'Credit Bureau': parts[parts.length - 1]             // Credit bureau name
      };
      categories.inquiries.push(inquiry);
      console.log('Inquiry Added:', inquiry);
    } else {
      console.log(`Line Does Not Have Enough Parts to Create an Inquiry:`, parts);
    }
  });
}

// Route to analyze the uploaded credit report
router.post('/:_id', upload.single('creditReport'), async (req, res) => {
  try {
    const { _id } = req.params;
    const fileBuffer = req.file.buffer;

    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    console.log('Analyzing Credit Report for Client:', _id);
    const categorizedAccounts = analyzePDFText(text);

    const creditReport = new CreditReport({
      client: _id,
      analysisResult: categorizedAccounts,
    });
    await creditReport.save();

    res.status(200).json(categorizedAccounts);
  } catch (error) {
    console.error('Error Analyzing Credit Report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
