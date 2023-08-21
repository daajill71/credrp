const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// Import the connectDB function
const connectDB = require('./connectdb');

// Call connectDB to establish the MongoDB connection
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
const disputeRoutes = require('./routes/disputeRoutes');
app.use('/api/disputes', disputeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
