import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminRegister.css';
import logo from './Copy of T.png'; // Same logo as used in AdminLogin

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [formValid, setFormValid] = useState(true);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || password !== confirmPassword || !/\S+@\S+\.\S+/.test(email)) {
      setFormValid(false);
      return false;
    }
    setFormValid(true);
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5004/admin/register', { name, email, password });
      setMessage(response.data.message);

      if (response.status === 201) {
        navigate('/admin-login');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Error during admin registration:', error);
    }
  };

  return (
    <div className="register-container">
      {/* Left section with text */}
      <div className="register-left">
        <header className="admin-header">
          <div className="logo">
            <img src={logo} alt="IndiTel Logo" className="logo-image" />
            <h1 className="company-name">Welcome to IndiTel</h1>
          </div>
        </header>
        <h1>We're holding the door for you!</h1>
        <p>Login now and manage all your
           Inditel services</p>
      </div>

      {/* Right section with form */}
      <div className="register-right">
        <h2>Admin Registration</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Admin Name"
            className={!formValid && !name ? 'input-error' : ''}
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            className={!formValid && (!email || !/\S+@\S+\.\S+/.test(email)) ? 'input-error' : ''}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={!formValid && !password ? 'input-error' : ''}
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={!formValid && (password !== confirmPassword) ? 'input-error' : ''}
            required
          />
          <button type="submit" className="register-button">Register</button>
          {message && <p className="message">{message}</p>}
          {!formValid && <p className="error-message">Please correct the errors above</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
