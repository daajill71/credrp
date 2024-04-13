require('events').EventEmitter.defaultMaxListeners = 20; // Set the limit to 20, or choose an appropriate value.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./connectdb');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Express JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Corrected syntax here

// Enable CORS
app.use(cors());

// Call connectDB to establish the MongoDB connection
connectDB();

// Import your routes
const disputeRoutes = require('./routes/disputeroutes'); // Import the route file
app.use('/api/disputes', disputeRoutes); // Use the route in your application

const disputelistRoute = require('./routes/disputelist');
app.use('/api/disputes', disputelistRoute);

// Import and use the client routes for POST requests
const clientRoutes = require('./routes/clientroutes');
app.use('/add-client', clientRoutes);

// Import and use the client list routes for GET requests
const clientListRoutes = require('./routes/clientlist');
app.use('/get-client', clientListRoutes);

// Import and use the document upload routes for file uploads
const documentRoutes = require('./routes/documentroutes');
app.use('/documents', documentRoutes);

// Import and use the document list routes for retrieving documents
const documentListRoutes = require('./routes/documentlist');
app.use('/documents', documentListRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
