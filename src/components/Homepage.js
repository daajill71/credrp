import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Your App</h1>
      <Link to="/registration">Register</Link>
    </div>
  );
}

export default HomePage;

