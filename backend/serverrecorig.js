const express = require('express');
const app = express(); // Define app as an instance of Express
// Import your routes
const disputeRoutes = require('./routes/disputeroutes'); 
const disputelistRoute = require('./routes/disputelist');
const clientRoutes = require('./routes/clientroutes');
const singleClientRoutes = require('./routes/singleClientRoutes');
const clientEditRoutes = require('./routes/clienteditroutes');
const clientDeleteRoutes = require('./routes/clientdeleteroutes');
const allClientsRoutes = require('./routes/allClientsRoutes');
const documentRoutes = require('./routes/documentroutes');
const documentListRoutes = require('./routes/documentlist');
const docupRoutes = require('./routes/docuproutes');
const docupListRoutes = require('./routes/docuplistroutes');
const clientNameRoutes = require('./routes/clientnameroutes');
const analyzecreditreportRoutes = require('./routes/analyzecreditreportRoutes');

// Mount your routes
app.use('/api/disputes', disputeRoutes);
app.use('/api/disputes', disputelistRoute);
app.use('/add-client', clientRoutes);
app.use('/get-client', singleClientRoutes);
app.use('/edit-client', clientEditRoutes);
app.use('/delete-client', clientDeleteRoutes);
app.use('/clients', allClientsRoutes);
app.use('/documents', documentRoutes);
app.use('/documents', documentListRoutes);
app.use('/docup', docupRoutes);
app.use('/docup', docupListRoutes);
app.use('/client', clientNameRoutes);
app.use('/analyze-credit-report', analyzecreditreportRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});