import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerLogin.css';
import logo from './Copy of T.png'; // Import the logo for IndiTel

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5004/auth/login', {
        email,
        password,
      });

      const { token } = response.data; // Get both token and customerId from response

      // Save JWT token and customerEmail in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('customerEmail', email); // Store customer email to be used later in the app

      if (response.status === 200) {
        alert('Login successful');
        // Redirect to customer dashboard
        navigate('/customer-dashboard');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during customer login:', error);
    }
  };
  const handleHomeClick=()=>{
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('authToken');
    navigate('/landing-page');
  }
  const handleRegister=()=>{
    navigate('/register');
  }

  // Redirect to the Forgot Password page
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="register-container">
      {/* Header matching LandingPage */}
      <div className="register-left">
        <header className="admin-header">
          <div className="logo">
            <img src={logo} alt="IndiTel Logo" className="logo-image" />
            <h1 className="company-name">Welcome to IndiTel</h1>
          </div>
          <button className="home1-button" onClick={handleHomeClick}>
          Home
        </button>
        </header>
        <h1>Customer Login</h1>
        <p>Access your IndiTel account to manage your telecom services and subscriptions</p>
      </div>

      <div className='register-right'>
      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Customer Email"
            className="form-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-input"
            required
          />
          <button type="submit" className="login-button">Login</button>
          {error && <p className="error-message">{error}</p>}
        
        <button className="forgot-password-button" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
        <p className="register-prompt">
            Not registered?{' '}
            <span className="register-link" onClick={handleRegister}>
              Register Now
            </span>
          </p>
          </form>
      </main>
    </div>
    </div>
  );
};

export default CustomerLogin;
