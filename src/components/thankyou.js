import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYou.css';  // Import the new CSS file for styling
import logo from './Copy of T.png'; // Import the logo for IndiTel

const ThankYou = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    localStorage.removeItem('customerID');
    localStorage.removeItem('authToken');
    navigate('/landing-page');  // Redirect to home page (or another relevant page)
  };

  return (
    <div className="thank-you-page">
      <header className="admin-header">
        <div className="logo">
          <img src={logo} alt="IndiTel Logo" className="logo-image" />
          <h1 className="company-name">Welcome to IndiTel</h1>
        </div>
      </header>
      <main className="thank-you-content">
        <h1>Thank You!</h1>
        <p>Your service activation request has been successfully sent to Admin for approval. Once approved, it will be communicated via email.</p>
        <button onClick={handleGoHome} className="home-button">Return to Home</button>
      </main>
    </div>
  );
};

export default ThankYou;