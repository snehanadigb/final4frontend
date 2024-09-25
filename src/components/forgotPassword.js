import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Style the form

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_PORT}/auth/forgot-password`, {
        email,
      });
      localStorage.setItem('email',email);

      if (response.status === 200) {
        setMessage('Password reset email sent. Please check your inbox.');
        setError('');
      }
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
      console.error('Error during forgot password request:', error);
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
