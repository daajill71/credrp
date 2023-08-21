const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI; // Retrieve the MongoDB URI from the environment

    if (!dbURI) {
      throw new Error('MongoDB URI is not defined in the .env file.');
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process on connection error
  }
};

module.exports = connectDB;
