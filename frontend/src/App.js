import React from 'react';
import CreateDispute from './components/CreateDispute';
//import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'; 
import Dashboard from './components/Dashboard';
import DisputeForm from './components/DisputeForm';
import DisputeList from './components/DisputeList';
//import Registration from './components/Registration';
import LoginForm from './components/LoginForm';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordResetRequestForm from './components/PasswordResetForm';
import Profile from './components/Profile';
import Registration from './components/Registration';


//Registration
//LoginForm
//Route path="/registration" element={<Registration />} />
              //Route path="/profile" element={<Profile />} />
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Credit Repair Software</h1>
      </header>
      <main>
        <CreateDispute />
        <Dashboard/>
        <DisputeForm/>
        <DisputeList/>
        <LoginForm/>
        <PasswordResetForm/>
        <PasswordResetRequestForm/>
        <Profile/>
        <Registration/>
        
        

        
      </main>
    </div>
  );
}
//Link to="/profile">Go to Profile</Link>
export default App;
//Router>
          
          //Routes>
            
            //* Add other routes as needed */}
            //* Example:
            //Route path="/passwordresetrequest" element={<Passwordresetrequest />} />
            //Route path="/passwordreset" element={<Passwordreset />} />
            //*/}
          //Routes>
        
      //Router>

      
      //* Add other components and features here */}