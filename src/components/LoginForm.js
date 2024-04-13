import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      // Assuming the backend responds with an authentication token
      const authToken = response.data.token;

      // Store the token securely (e.g., in a cookie or local storage)
      localStorage.setItem('authToken', authToken);

      // Redirect to the authenticated user's dashboard or another route
      // You can use react-router-dom for client-side routing
      // Example: history.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    // Remove the authentication token from storage
    localStorage.removeItem('authToken');

    // Redirect to the login page or another route
    // Example: history.push('/login');
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Login;
