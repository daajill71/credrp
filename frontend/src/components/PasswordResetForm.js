import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); // Initially assume the token is valid

  useEffect(() => {
    const resetToken = window.location.pathname.split('/').pop(); // Extract the reset token from the URL

    // Validate the reset token by making an API request to your backend
    axios
      .post('/api/validate-reset-token', { resetToken })
      .then((response) => {
        if (response.status === 200) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      })
      .catch((error) => {
        setTokenValid(false);
      });
  }, []);

  const resetPassword = async () => {
    if (!tokenValid) {
      setResetError('Invalid or expired reset token');
      return;
    }

    if (password !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    try {
      const resetToken = window.location.pathname.split('/').pop(); // Extract the reset token from the URL
      const response = await axios.post('/api/reset-password', {
        newPassword: password,
        resetToken: resetToken,
      });

      if (response.status === 200) {
        setResetSuccess(true);
      }
    } catch (error) {
      setResetError('Password reset failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {resetSuccess ? (
        <div>
          <p>Password reset successfully. You can now log in with your new password.</p>
        </div>
      ) : (
        <div>
          {tokenValid ? (
            <div>
              <p>Enter your new password below:</p>
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button onClick={resetPassword}>Reset Password</button>
              {resetError && <p className="error">{resetError}</p>}
            </div>
          ) : (
            <p>Invalid or expired reset token. Please request a new password reset.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
