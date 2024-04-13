// Step 1: Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document'); // Assuming you have a Document model
const path = require('path');

// Step 2: Define Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // Use _id provided by MongoDB instead of clientId
    const documentId = req.body._id;
    cb(null, documentId + path.extname(file.originalname));
  },
});

// Step 3: Create a Multer instance with the defined storage configuration
const upload = multer({ storage: storage });

// Step 4: Define a route for handling file uploads
router.post('/upload',
  // Step 5: Use Multer to handle file uploads with specified field names and maximum counts
  upload.fields([
    { name: 'driverLicense', maxCount: 1 },
    { name: 'proofOfMailingAddress', maxCount: 1 },
    { name: 'socialSecurityCard', maxCount: 1 },
    { name: 'otherDocument', maxCount: 3 },
  ]),
  async (req, res, next) => {
    try {
      // Step 6: Access the uploaded files for different fields
      const driverLicenseFile = req.files['driverLicense'][0];
      const proofOfMailingAddressFile = req.files['proofOfMailingAddress'][0];
      const socialSecurityCardFile = req.files['socialSecurityCard'][0];
      const otherDocumentFiles = req.files['otherDocument'];

      // Step 7: Create or update the document with the given _id
      const document = await Document.findOneAndUpdate(
        { _id: req.body._id },
        {
          driverLicense: {
            documentName: driverLicenseFile.originalname,
            fileBuffer: driverLicenseFile.buffer,
          },
          socialSecurityCard: {
            documentName: socialSecurityCardFile.originalname,
            fileBuffer: socialSecurityCardFile.buffer,
          },
          proofOfMailingAddress: {
            documentName: proofOfMailingAddressFile.originalname,
            fileBuffer: proofOfMailingAddressFile.buffer,
          },
          otherDocument: otherDocumentFiles.map(file => ({
            documentName: file.originalname,
            fileBuffer: file.buffer,
          })),
        },
        { upsert: true, new: true }
      );

      // Step 8: Respond with a success message and information about the uploaded documents
      res.status(201).json({
        message: 'Documents uploaded successfully',
        documents: document,
      });
    } catch (err) {
      next(err);
    }
  });

// Step 9: Handle Multer errors with a more standardized format
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);
    res.status(400).json({ error: 'Multer Error', message: err.message });
  } else {
    next(err);
  }
});

// Step 10: Export the router for use in your application
module.exports = router;
