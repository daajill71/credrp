const express = require('express');
//const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const disputelistRoute = require('./routes/disputelist');
const createdisputeRoute = require('./routes/createdispute');

// Import the connectDB function
const connectDB = require('./connectdb');

// Import the seedDB function (for seeding sample data)
const seedDB = require('./seeddb');

// Call connectDB to establish the MongoDB connection
connectDB();

// Define CORS options (if needed)
const corsOptions = {
  origin: 'https://credrp-frontend.onrender.com', // Replace with the origin of your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 204, // Set the status for preflight requests to 204
};

// Middleware
//app.use(bodyParser.json());

// Enable CORS with options
app.use(cors(corsOptions));

//Express
app.use(express.json());

// Routes
//const disputeRoutes = require('./routes/disputeRoutes');
//app.use('/api/disputes', disputeRoutes);

// Import disputelist Routes

app.use('/api/disputes', disputelistRoute);
app.use('/api/disputes', createdisputeRoute);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Run the seedDB function to seed sample data (call this after the server starts)
  seedDB();
});
