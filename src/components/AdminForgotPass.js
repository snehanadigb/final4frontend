import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // Custom CSS for forgot password

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_PORT}/admin/forgot-password`, { email });
        localStorage.setItem('email',email);
      if (response.status === 200) {
        setMessage('Password reset email sent successfully');
        // Optionally navigate to a different page or show a success message
      } else {
        setError('Error sending password reset email');
      }
    } catch (error) {
      setError('Error sending password reset email');
      console.error('Error during forgot password request:', error);
    }
  };

  return (
    <div className="forgot-password-page">
      <header className="forgot-password-header">
        <h1>Forgot Password</h1>
      </header>

      <main className="forgot-password-main">
        <form className="forgot-password-form" onSubmit={handleForgotPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
          />
          <button type="submit">Send Reset Link</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </main>
    </div>
  );
};

export default AdminForgotPassword;
