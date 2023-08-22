const mongoose = require('mongoose');
const Dispute = require('./models/Dispute'); // Import your Mongoose model
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDB = async () => { // Define seedDB as an async function
  try {
    const sampleData = [
      {
        clientName: 'Client A',
        description: 'Dispute description for Client A',
      },
      {
        clientName: 'Client B',
        description: 'Dispute description for Client B',
      },
      // Add more sample data as needed
    ];

    await Dispute.deleteMany({}); // Clear existing data
    await Dispute.insertMany(sampleData); // Insert new sample data
    console.log('Sample data inserted successfully.');
  } catch (err) {
    console.error('Error inserting sample data:', err);
  } finally {
    mongoose.connection.close(); // Close the MongoDB connection when done
  }
};

module.exports = seedDB;
