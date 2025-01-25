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
  const keywords = ['delinquent', 'latepayment', 'charge-off'];

  const categories = {
    delinquent: [],
    latepayment: [],
    chargeOff: [],
    inquiries: []
  };

  console.log('Parsed Text:', text);

  const accountsSection = text.split('Inquiries')[0].split('Accounts:')[1]?.trim();
  const inquiriesSection = text.split('Inquiries')[1]?.trim();

  console.log('Accounts Section:', accountsSection);
  console.log('Inquiries Section:', inquiriesSection);

  if (accountsSection) {
    const accountBlocks = accountsSection.split('\n\n');
    accountBlocks.forEach(block => processAccountBlock(block.trim()));
  }

  if (inquiriesSection) {
    const inquiryLines = inquiriesSection.split('\n').filter(line => line.trim() !== '');

    if (inquiryLines.length > 0) {
      inquiryLines.shift();
    }

    processInquiryBlock(inquiryLines);
  }

  function processAccountBlock(block) {
    const lines = block.split('\n');
    let accountDetails = {};
    let accountName = '';

    lines.forEach(line => {
      if (line.trim() === '' || line.trim().startsWith('Inquiries')) {
        return;
      }

      if (!line.includes(':') && line.trim() !== '') {
        if (accountName && Object.keys(accountDetails).length > 0) {
          categorizeAccount({ accountName, ...accountDetails });
        }

        accountName = line.trim();
        accountDetails = {};
        console.log('Detected Account Name:', accountName);
      } else {
        const [key, ...valueParts] = line.split(':');
        const trimmedKey = key.trim();
        const trimmedValue = valueParts.join(':').trim();
        accountDetails[trimmedKey] = trimmedValue;
      }
    });

    if (accountName && Object.keys(accountDetails).length > 0) {
      categorizeAccount({ accountName, ...accountDetails });
    }
  }

  function processInquiryBlock(lines) {
    const datePatterns = [/\b\d{4}-\d{2}-\d{2}\b/, /\b\d{2}\/\d{2}\/\d{4}\b/];

    lines.forEach((line, index) => {
      console.log(`Original inquiry line ${index + 1}:`, line);

      let extractedDatesBefore = [];
      datePatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          extractedDatesBefore.push(...matches);
        }
      });
      console.log(`Dates found before normalization in line ${index + 1}:`, extractedDatesBefore.join(', ') || 'None');

      let cleanedLine = line
        .replace(/(\d)\s*-\s*(\d)/g, '$1-$2')
        .replace(/(\d)\s*\/\s*(\d)/g, '$1/$2');

      let normalizedLine = cleanedLine
        .replace(/(\d{2}\/\d{2}\/\d{4})/g, ' $1 ')
        .replace(/(\d{4}-\d{2}-\d{2})/g, ' $1 ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\t+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      normalizedLine = normalizedLine
        .replace(/(\d{2}\/\d{2}\/\d{4})/g, ' $1 ')
        .replace(/(\d{4}-\d{2}-\d{2})/g, ' $1 ')
        .replace(/\s{2,}/g, ' ');

      let extractedDatesAfter = [];
      datePatterns.forEach(pattern => {
        const matches = normalizedLine.match(pattern);
        if (matches) {
          extractedDatesAfter.push(...matches);
        }
      });
      console.log(`Dates found after normalization in line ${index + 1}:`, extractedDatesAfter.join(', ') || 'None');

      console.log(`Normalized inquiry line ${index + 1}:`, normalizedLine);

      const parts = normalizedLine.split(' ').map(part => part.trim()).filter(part => part);
      console.log(`Split parts of line ${index + 1}:`, parts);

      let dateFound = false;
      let dateIndex = -1;
      parts.forEach((part, i) => {
        datePatterns.forEach(pattern => {
          if (pattern.test(part)) {
            console.log(`Identified date in inquiry line ${index + 1}:`, part);
            dateFound = true;
            dateIndex = i;
          }
        });
      });

      if (!dateFound) {
        console.log(`No date found in inquiry line ${index + 1}.`);
      }

      if (dateFound && parts.length >= 4) {
        const creditorParts = [];
        const typeOfBusinessParts = [];

        for (let i = 0; i < dateIndex; i++) {
          if (i >= dateIndex - 2) {
            typeOfBusinessParts.push(parts[i]);
          } else {
            creditorParts.push(parts[i]);
          }
        }

        const creditor = creditorParts.join(' ');
        const typeOfBusiness = typeOfBusinessParts.join(' ');

        const inquiry = {
          Creditor: creditor,
          'Type of Business': typeOfBusiness,
          'Date On Inquiry': parts[dateIndex],
          'Credit Bureau': parts.slice(dateIndex + 1).join(' ')
        };

        categories.inquiries.push(inquiry);
      } else {
        console.log('Line does not have enough parts to create an inquiry:', parts);
        console.log('Original line:', normalizedLine);
      }
    });
  }

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

  console.log('Categories:', categories);
  return categories;
}

// Route to analyze the uploaded credit report
router.post('/:_id', upload.single('creditReport'), async (req, res) => {
  try {
    const { _id } = req.params;
    const fileBuffer = req.file.buffer;

    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

    const categorizedAccounts = analyzePDFText(text);

    console.log('Analysis Result:', categorizedAccounts);

    const creditReport = new CreditReport({
      client: _id,
      analysisResult: categorizedAccounts
    });
    await creditReport.save();

    res.status(200).json(categorizedAccounts);
  } catch (error) {
    console.error('Error analyzing credit report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
