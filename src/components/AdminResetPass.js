import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Custom CSS for reset password

const AdminResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { search } = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(search);
  const token = queryParams.get('token');
  

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
        const email = localStorage.getItem('email');
        console.log(email);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_PORT}/admin/reset-password`, { email,  newPassword });

      if (response.status === 200) {
        setMessage('Password reset successfully');
        // Optionally navigate to login page or show success message
        navigate('/admin-login');
      } else {
        setError('Error resetting password');
      }
    } catch (error) {
      setError('Error resetting password');
      console.error('Error during password reset:', error);
    }
  };

  return (
    <div className="reset-password-page">
      <header className="reset-password-header">
        <h1>Reset Password</h1>
      </header>

      <main className="reset-password-main">
        <form className="reset-password-form" onSubmit={handleResetPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button type="submit">Reset Password</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </main>
    </div>
  );
};

export default AdminResetPassword;
