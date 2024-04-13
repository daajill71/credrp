const express = require('express');
const router = express.Router();
const multer = require('multer');
const Docup = require('../models/Docup');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../docuploaded'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/uploaded',
  upload.fields([
    { name: 'driverLicense', maxCount: 1 },
    { name: 'mailingAddressProof', maxCount: 1 },
    { name: 'socialSecurityCard', maxCount: 1 },
    { name: 'otherDocument', maxCount: 3 }
  ]),
  async (req, res, next) => {
    try {
      const driverLicenseFile = req.files['driverLicense'][0];
      const mailingAddressProofFile = req.files['mailingAddressProof'][0];
      const socialSecurityCardFile = req.files['socialSecurityCard'][0];
      const otherDocumentFile = req.files['otherDocument'][0];

      const driverLicensePromise = createDocup('Driver\'s License', driverLicenseFile);
      const mailingAddressProofPromise = createDocup('Proof of Current Mailing Address', mailingAddressProofFile);
      const socialSecurityCardPromise = createDocup('Social Security Card', socialSecurityCardFile);
      const otherDocumentPromise = createDocup('Other Document', otherDocumentFile);

      const results = await Promise.all([driverLicensePromise, mailingAddressProofPromise, socialSecurityCardPromise, otherDocumentPromise]);
      res.status(201).json({
        message: 'Docups uploaded successfully',
        docups : results,
      });
    } catch (err) {
      next(err);
    }
  }
);

async function createDocup(docupType, docupData) {
  const docup = new Docup({
    docupType: docupType,
    docupName: docupData.originalname,
  });
  return docup.save();
}

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);
    res.status(400).json({ error: 'Multer Error: ' + err.message });
  } else {
    next(err);
  }
});

module.exports = router;
