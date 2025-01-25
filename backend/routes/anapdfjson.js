const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFParser = require('pdf2json');
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
  console.log('Raw Extracted Text:', text);

  const lines = text.split('\n').map(line => {
    if (line.trim().startsWith('Account#')) {
      console.log('Preserving Format for Line:', line.trim());
      return line.trim();
    }
    return line
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      .replace(/:/g, ': ')
      .replace(/\$/g, ' $')
      .trim();
  });

  const normalizedText = lines.join('\n');
  console.log('Normalized Text:', normalizedText);
  return normalizedText;
}

// Main function to analyze the text
function analyzePDFText(text) {
  const categories = {
    TransUnion: { 'Collection/Chargeoff': [], 'Late Payment': [] },
    Experian: { 'Collection/Chargeoff': [], 'Late Payment': [] },
    Equifax: { 'Collection/Chargeoff': [], 'Late Payment': [] }
  };

  const normalizedText = normalizeText(text);

  const startMarker = 'Revolving Accounts: Accountswithanopen-endterm';
  const endMarker = 'Public Information';

  console.log(`Start Marker Found: ${normalizedText.includes(startMarker)}`);
  console.log(`End Marker Found: ${normalizedText.includes(endMarker)}`);

  const accountsSection = normalizedText.includes(startMarker) && normalizedText.includes(endMarker)
    ? normalizedText.split(startMarker)[1]?.split(endMarker)[0]?.trim()
    : '';
  console.log('Account Section:', accountsSection);

  if (!accountsSection) {
    console.error('Accounts section could not be extracted.');
    return categories;
  }

  const accountBlocks = [];
  let currentBlock = [];
  accountsSection.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine === '') return;
    if (/^[A-Z\s\/]+$/.test(trimmedLine) && !trimmedLine.startsWith('Inquiries')) {
      if (currentBlock.length > 0) {
        console.log('Current Block Before Push:', currentBlock);
        accountBlocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
    }
    currentBlock.push(trimmedLine);
  });
  if (currentBlock.length > 0) {
    console.log('Current Block Before Push:', currentBlock);
    accountBlocks.push(currentBlock.join('\n'));
  }

  console.log('Grouped Account Blocks:', accountBlocks);

  accountBlocks.forEach(block => processAccountBlock(block, categories));

  console.log('Categories After All Processing:', categories);
  return categories;
}

// Function to process each block of account information
function processAccountBlock(block, categories) {
  const lines = block.split('\n');
  let accountName = '';
  let bureauValues = { TransUnion: {}, Experian: {}, Equifax: {} };

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine === '') return;
    if (trimmedLine.toLowerCase().includes('nonereported')) {
      console.log(`Skipping line: ${trimmedLine}`);
      return;
    }
    if (/^[A-Z\s]+$/.test(trimmedLine)) {
      if (accountName) {
        console.log('Finalizing Account Details:', bureauValues);
        categorizeByBureau(bureauValues, categories);
      }
      accountName = trimmedLine;
      console.log('Detected Account Name:', accountName);
      bureauValues = { TransUnion: {}, Experian: {}, Equifax: {} };
    } else if (trimmedLine.startsWith('Account#')) {
      const accountNumber = trimmedLine.replace('Account#', '').trim();
      console.log(`Raw Extracted Account#: ${accountNumber}`);

      const accountParts = accountNumber.split(/\s+/);
      bureauValues.TransUnion['Account#'] = accountParts[0];
      bureauValues.Experian['Account#'] = accountParts[1];
      bureauValues.Equifax['Account#'] = accountParts[2];
      console.log('Mapped Account Numbers:', bureauValues);
    } else if (trimmedLine.includes(':')) {
      const [key, ...valueParts] = trimmedLine.split(':');
      const trimmedKey = key.trim();
      const trimmedValue = valueParts.join(':').trim();
      const values = trimmedValue.split(/\s+/);
      bureauValues.TransUnion[trimmedKey] = values[0];
      bureauValues.Experian[trimmedKey] = values[1];
      bureauValues.Equifax[trimmedKey] = values[2];
      console.log(`Mapped Values for ${trimmedKey}:`, bureauValues);
    }
  });
  if (accountName) {
    bureauValues.TransUnion['Account Name'] = accountName;
    bureauValues.Experian['Account Name'] = accountName;
    bureauValues.Equifax['Account Name'] = accountName;
    console.log('Finalizing Last Account Details:', bureauValues);
    categorizeByBureau(bureauValues, categories);
  }
}

// Function to categorize by credit bureau and payment status
function categorizeByBureau(account, categories) {
  console.log('Categorizing Account:', account);
  ['TransUnion', 'Experian', 'Equifax'].forEach(bureau => {
    const paymentStatus = account[bureau]?.['Payment Status']?.toLowerCase();
    const accountDetails = {
      'Account Name': account[bureau]?.['Account Name'] || 'N/A',
      'Account#': account[bureau]?.['Account#'] || 'N/A',
      'Balance Owed': account[bureau]?.['Balance Owed'] || 'N/A',
      'Payment Status': account[bureau]?.['Payment Status'] || 'N/A',
    };
    if (paymentStatus?.includes('collection') || paymentStatus?.includes('chargeoff')) {
      categories[bureau]['Collection/Chargeoff'].push(accountDetails);
    } else if (paymentStatus?.includes('late payment')) {
      categories[bureau]['Late Payment'].push(accountDetails);
    }
  });
}

router.post('/:_id', upload.single('creditReport'), async (req, res) => {
  try {
    const { _id } = req.params;
    const fileBuffer = req.file.buffer;

    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const text = pdfParser.getRawTextContent();
      console.log('Extracted PDF Text:', text);

      const categorizedAccounts = analyzePDFText(text);

      const creditReport = new CreditReport({
        client: _id,
        analysisResult: categorizedAccounts,
      });
      creditReport.save();

      res.status(200).json(categorizedAccounts);
    });

    pdfParser.on('pdfParser_dataError', (error) => {
      console.error('Error Parsing PDF:', error.parserError);
      res.status(500).json({ error: 'Error parsing the PDF' });
    });

    pdfParser.parseBuffer(fileBuffer);
  } catch (error) {
    console.error('Error Analyzing Credit Report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
