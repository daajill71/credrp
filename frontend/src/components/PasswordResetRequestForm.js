import React, { useState } from 'react';

function PasswordResetRequestForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend API for password reset request
      const response = await fetch('/api/password-reset-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        setMessage('Password reset request sent. Check your email for further instructions.');
      } else {
        setMessage('Password reset request failed. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Password reset request failed. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Password Reset Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default PasswordResetRequestForm;
