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

  // Add consistent markers between bureau names
  text = text.replace(/(Transunion®)\s+(Experian®)\s+(Equifax®)/g, '$1|$2|$3');

  // Replace merged account numbers with a consistent delimiter
  text = text.replace(/Account#\s*(\*+)\s*(\*+)\s*(\d+\**)/g, 'Account# $1|$2|$3');

  console.log('Text After Adding Markers and Separating Account Numbers:', text); // Debug log

  const lines = text.split('\n').map(line => {
    if (line.trim().startsWith('Account#')) {
      console.log('Preserving and Normalizing Account Line:', line.trim());
      return line.trim();
    }

    // Apply normalization to other lines
    return line
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
      .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Add space between letters and numbers
      .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Add space between numbers and letters
      .replace(/:/g, ': ') // Ensure space after colons
      .replace(/\$/g, ' $') // Add space before dollar signs
      .trim();
  });

  const normalizedText = lines.join('\n');
  console.log('Normalized Text:', normalizedText); // Log the normalized text
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
        console.log('Current Block Before Push:', currentBlock); // Debug log
        accountBlocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
    }

    currentBlock.push(trimmedLine);
  });

  if (currentBlock.length > 0) {
    console.log('Current Block Before Push:', currentBlock); // Debug log
    accountBlocks.push(currentBlock.join('\n'));
  }

  console.log('Grouped Account Blocks:', accountBlocks);

  accountBlocks.forEach((block) => processAccountBlock(block, categories));

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

    // Skip empty lines
    if (trimmedLine === '') return;

    // Skip lines containing "NONEREPORTED"
    if (trimmedLine.toLowerCase().includes('nonereported')) {
      console.log(`Skipping line: ${trimmedLine}`); // Debug log
      return;
    }

    // Detect account names
    if (/^[A-Z\s]+$/.test(trimmedLine)) {
      if (accountName) {
        console.log('Finalizing Account Details:', bureauValues); // Debug log
        categorizeByBureau(bureauValues, categories);
      }

      accountName = trimmedLine;
      console.log('Detected Account Name:', accountName); // Debug log
    } else if (trimmedLine.startsWith('Account#')) {
      // Extract and split account numbers based on the delimiter "|"
      const match = trimmedLine.match(/Account# (\*+)\|(\*+)\|(\d+\**)/);
      if (match) {
        bureauValues.TransUnion['Account#'] = match[1];
        bureauValues.Experian['Account#'] = match[2];
        bureauValues.Equifax['Account#'] = match[3];
        console.log('Mapped Account Numbers:', bureauValues);
      } else {
        console.error(`Pattern not matched for line: ${trimmedLine}`);
      }
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
  console.log('Categorizing Account:', account); // Debug log
  ['TransUnion', 'Experian', 'Equifax'].forEach(bureau => {
    const paymentStatus = account[bureau]?.['Payment Status']?.toLowerCase();

    const accountDetails = {
      'Account Name': account[bureau]?.['Account Name'] || 'N/A',
      'Account#': account[bureau]?.['Account#'] || 'Not Reported',
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

    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text;

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
