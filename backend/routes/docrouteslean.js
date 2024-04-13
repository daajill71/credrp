const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document');

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({ storage: storage });

// Define an endpoint for uploading files
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const document = new Document({
      documentType: req.body.documentType,
      documentName: req.file.originalname, // Use the original file name
      fileBuffer: req.file.buffer, // Store file data in a buffer
    });

    const result = await document.save();
    res.status(201).json({
      message: 'Document uploaded successfully',
      document: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
