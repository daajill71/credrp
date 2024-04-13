const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path'); // For working with file paths

// Define storage settings for multer (you can customize this based on your needs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

// Define an endpoint for uploading files
router.post('/upload', upload.array('files', 4), (req, res) => {
  // Handle the uploaded files here, save them to a database or storage system

  // Respond with a success message
  res.status(200).json({ message: 'Files uploaded successfully' });
});

module.exports = router;
