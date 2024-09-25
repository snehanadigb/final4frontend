import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_PORT}/auth/reset-password`, {
        email,
        token,
        newPassword,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully.');
        setError('');
        setTimeout(() => {
          navigate('/customer-login');
        }, 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      console.error('Error during password reset:', error);
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;
