import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DisputeFormnoid from './components/DisputeFormnoid';
import DisputeForm from './components/DisputeForm';
import DisputeList from './components/DisputeList';
import ClientUploadForm from './components/ClientUploadForm';
import ClientInfoForm from './components/ClientInfoForm';
import ClientUploadsOnlyForm from './components/ClientUploadsOnlyForm';
import ClientListForm from './components/ClientListForm';
import Homepage from './components/Homepage';
//Route path="/client-upload/:id" element={<ClientUploadForm />} />
function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <h1>Credit Repair Software</h1>
          <nav>
            <ul>
              <li>
                <Link to="/dispute-form">Dispute Form No ID</Link>
              </li>
              <li>
                <Link to="/dispute-list">Dispute List</Link>
              </li>
              <li>
                <Link to="/client-upload">Client Upload Form</Link>
              </li>
              <li>
                <Link to="/client-info">Client Info Form</Link>
              </li>
              <li>
                <Link to="/client-uploadsonly">Client Uploads Only Form</Link>
              </li>
              <li>
                <Link to="/client-list">List of Clients</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/dispute-form" element={<DisputeFormnoid />} />
            <Route path="/dispute-list" element={<DisputeList />} />
            <Route path="/client-upload/:id"element={<ClientUploadForm />} />
            <Route path="/client-uploadsonly"element={<ClientUploadsOnlyForm />} />
            <Route path="/dispute-form/:id"element={<DisputeForm />} />
           
              
            
            <Route path="/client-info" element={<ClientInfoForm />} />
            <Route path="/client-list" element={<ClientListForm />} />

            <Route path="/*" element={<Homepage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
