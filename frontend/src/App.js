import React from 'react';
//import DisputeForm from './components/DisputeForm';
import DisputeList from './components/DisputeList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Credit Repair Software</h1>
      </header>
      <main>
        <DisputeList/>        
        {/* Add other components and features here */}
      </main>
    </div>
  );
}

export default App;
//DisputeForm