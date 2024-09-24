import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Registration.css';
import logo from './Copy of T.png';
import img from './1.png' 
import { useNavigate } from 'react-router-dom';// Logo used in CustomerLogin

const Registration = () => {
  const [f_name, setFName] = useState('');
  const [l_name, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('register'); // 'register' or 'verify'
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Step progress state
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const [success,setSuccess]=useState(''); // Cooldown for resend

  // Validate functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNo = (phone_no) => /^\d{10}$/.test(phone_no);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(password);

  const checkIfAlreadyRegistered = async () => {
    try {
      const response = await axios.post('http://localhost:5004/auth/check-status', { email });
      if (response.data.isVerified) {
        setError('This email is already registered and verified. Please log in.');
      } else if (response.data.isRegistered) {
        setError('This email is already registered but not yet verified. Redirecting to OTP verification page.');
        setStage('verify');
        setStep(2);
        setOtpSent(true);
      }
    } catch (error) {
      setError('Error checking registration status. Please try again.');
      console.error('Error checking email status:', error);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Perform client-side validation before proceeding
    if (!validateEmail(email)) return setError('Please enter a valid email address.');
    if (!validatePhoneNo(phone_no)) return setError('Please enter a valid 10-digit phone number.');
    if (!validatePassword(password)) return setError('Password must contain an uppercase letter, special character, numeric digit, and be at least 6 characters.');
  
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      // Make a POST request to your backend registration API
      const response = await axios.post('http://localhost:5004/auth/register', { 
        f_name, l_name, email, password, phone_no, address 
      });
  
      // Check if registration was successful (201)
      if (response.status === 201) {
        const { customerId, token, message } = response.data;
        localStorage.setItem('customerId', customerId);
        localStorage.setItem('authToken', token);
  
        // Proceed to OTP verification stage
        setStage('verify');
        setStep(2);
        setOtpSent(true);
        setResendCooldown(30); // Cooldown timer for resending OTP
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        const errorMessage = error.response.data.message;
        const email=error.response.data.email;
        const token=error.response.data.token;
  
        if (errorMessage.includes('Email already registered but not verified. OTP resent for email verification.')) {
        
          localStorage.setItem('authToken', token);
          localStorage.setItem('email',email);
          setStage('verify');
          console.log('Current stage:', stage);
          setStep(2);
          setOtpSent(true);
          setResendCooldown(30);
        } else if (errorMessage.includes('Email is already registered and verified')) {
          alert('This email is already registered and verified. Please login.');
          window.location.href = '/customer-login';
        } else {
          alert('Registration failed. Please try again.');
        }
      } else {
        alert('An error occurred during registration. Please try again.');
      }
  
      console.error('Error during registration:', error);
    }
    finally {
      setLoading(false); // End loading after the request is complete
    }
  };
  

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Please enter a valid 6-digit OTP.');
   
    try {
      const token = localStorage.getItem('authToken');
      //const email=localStorage.getItem('email');
      const response = await axios.post('http://localhost:5004/auth/verify-email', { email, otp }, 
        {headers: { 'Authorization': `Bearer ${token}` }
    },);
      
      if (response.status === 200) {
        alert('Email verified successfully!');
        window.location.href = '/upload-documents'; // Redirect to document upload page
        setStep(3); // Proceed to next step after verification
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
      console.error('Error during OTP verification:', error);
    }
  };
  const handleHomeClick=()=>{
    navigate('/landing-page')
  }

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5004/auth/resend-otp', { email }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) {
        alert('New OTP has been sent to your email!');
        setResendCooldown(30); // Reset cooldown timer
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Error during OTP resend:', error);
    }
    finally {
      setLoading(false); // End loading after the request is complete
    }
  };

  // Cooldown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    console.log('Stage changed:', stage);
  }, [stage]);
  
  return (
    <div className={`register-container ${loading ? 'blur' : ''}`}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="register-left">
        <header className="login-header">
          <div className="logo1">
            <img src={logo} alt="IndiTel Logo" className="logo-image" />
            <h1 className="company-name">Welcome to IndiTel</h1>
          </div>
          <button className="home1-button" onClick={handleHomeClick}>
          Home
        </button>
        </header>
        <img className="img" src={img}/>
      </div>

      <div className="register-right">
        <form className="registration-form" onSubmit={stage === 'register' ? handleRegister : handleVerify} disabled={loading}>
         
          {stage === 'register' ? (
            <>
              <input type="text" value={f_name} onChange={(e) => setFName(e.target.value)} placeholder="First Name" required disabled={loading} />
              <input type="text" value={l_name} onChange={(e) => setLName(e.target.value)} placeholder="Last Name" required disabled={loading} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={loading} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required disabled={loading} />
              <input type="text" value={phone_no} onChange={(e) => setPhoneNo(e.target.value)} placeholder="Phone Number" required disabled={loading} />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required disabled={loading} />
            </>
          ) : (
            <>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
              <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0}>
                Resend OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
              </button>
            </>
          )}
          <button type="submit" className="submit-button" disabled={loading}>
            {stage === 'register' ? 'Register' : 'Verify OTP'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};



export default Registration;
