import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';
import { TypeAnimation } from 'react-type-animation';
import logo from './Copy of T.png'; // Replace with your actual logo image path
import HeroImage from './one.jpg'; // Replace with your actual moving image path
import aboutImage from './two.jpeg'; // Replace with your actual About Us image path

const LandingPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [planType, setPlanType] = useState('All'); // State for selected plan type

  // Fetch plans from the backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {

        const response = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/services/getplans`); // Adjust endpoint as necessary
        const data = await response.json();
        setPlans(data);
        setFilteredPlans(data); // Initialize filtered plans
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  // Update filtered plans based on selected type
  useEffect(() => {
    if (planType === 'All') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(plan => plan.planType === planType));
    }
  }, [planType, plans]);
  const handleCustomerClick = (planId) => {
    // Store the selected plan ID in localStorage or state
    localStorage.setItem('selectedPlanId', planId);
  
    // Navigate to the registration page
    navigate('/register');
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  const handleCustomerRegister = () => {
    navigate('/register');
  };
  const handleCustomerLogin = () => {
    navigate('/customer-login');
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-header">
        <div className="logo">
          <img src={logo} alt="IndiTel Logo" className="logo-image" />
          <h1 className="company-name">IndiTel</h1>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li onClick={() => window.scrollTo(0, 0)}>Home</li>
            <li onClick={() => window.scrollTo(0, document.getElementById('about-section').offsetTop)}>About Us</li>
            <li onClick={() => window.scrollTo(0, document.getElementById('services-section').offsetTop)}>Services</li>
          </ul>
        </nav>
        <div className="login-buttons">
          <button className="admin-login" onClick={handleAdminClick}>Admin Login</button>
          <button className="customer-login" onClick={handleCustomerLogin}>Customer Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section class="hero-section">
        <div class="hero-content">
        <h1 class="hero-title">
                    <TypeAnimation
                  sequence={[
                    // Same substring at the start will only be typed out once, initially
                    'Welcome to Inditel !!',
                    1000,
                    'We provide communications and services',
                    1000,
                    'We offer the best Plans',
                    1000
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
            </h1>
            <p class="hero-subtitle">Join us today and explore amazing opportunities!</p>
            <button class="cta-button" onClick={handleCustomerRegister}>Get Started</button>
            <button class="cta-button-2" onClick={() => window.scrollTo(0, document.getElementById('services-section').offsetTop)}>Browse Plans</button>
        </div>
        <div class="hero-image-container">
        <img src={HeroImage} alt="About Us" className="about-image" />
            </div>
     </section>



      {/* About Us Section */}
      <section id="about-section" className="about-section">
        <div className="about-content">
          <div className="about-image-container">
            <img src={aboutImage} alt="About Us" className="about-image" />
          </div>
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              IndiTel is committed to providing reliable and affordable communication services. Our mission is to ensure seamless connectivity for all our customers, offering the best mobile and broadband solutions tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="services-section">
        <h2>Our Plans</h2>

        {/* Dropdown for selecting plan type */}
        <div className='dropDown'>
        <select value={planType} onChange={(e) => setPlanType(e.target.value)}>
          <option value="All">All</option>
          <option value="Prepaid">Prepaid</option>
          <option value="Postpaid">Postpaid</option>
        </select>
        </div>

        <div className="catalog">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <div className="catalog-item card" key={plan.id}>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <p>Price: ₹{plan.price}</p>
                {/* <div className="services-included">
                  {plan.servicesIncluded?.fiberLandline && (
                    <div>
                      <h4>Fiber + Landline</h4>
                      <p>{plan.servicesIncluded.fiberLandline.speed}</p>
                      <p>{plan.servicesIncluded.fiberLandline.calls}</p>
                    </div>
                  )}
                  {plan.servicesIncluded?.dth && (
                    <div>
                      <h4>DTH</h4>
                      <p>{plan.servicesIncluded.dth.value}</p>
                    </div>
                  )}
                </div> */}
                <button onClick={() => handleCustomerClick(plan.id)}>Register</button>
              </div>
            ))
          ) : (
            <p>No plans available</p>
          )}
        </div>
      </section>

{/* reviews section */}
<section class="customer-reviews-section">
    <h2>What Our Customers Say</h2>
    <div class="reviews-container">
        <div class="review-card">
            <p class="review-text">"This service has transformed my business! Highly recommend."</p>
            <h4 class="customer-name">John Doe</h4>
            <span class="customer-rating">★★★★★</span>
        </div>
        <div class="review-card">
            <p class="review-text">"Excellent support and great products. Will use again!"</p>
            <h4 class="customer-name">Jane Smith</h4>
            <span class="customer-rating">★★★★★</span>
        </div>
        <div class="review-card">
            <p class="review-text">"A game-changer in the industry. Fantastic experience."</p>
            <h4 class="customer-name">Emily Johnson</h4>
            <span class="customer-rating">★★★★★</span>
        </div>
    </div>
</section>

      {/* Footer Section */}
      <footer className="landing-footer">
              <div class="footer-column">
                  <h3>About Us</h3>
                  <ul>
                      <li><a href="#">Company Info</a></li>
                      <li><a href="#">Careers</a></li>
                  </ul>
              </div>
              <div class="footer-column">
                  <h3>Contact</h3>
                  <ul>
                      <li><a href="#">Email Us</a></li>
                      <li><a href="#">Support</a></li>
                  </ul>
              </div>
              <div class="footer-column footer-terms">
                  <h3>Legal</h3>
                  <ul>
                      <li><a href="#">Privacy Policy</a></li>
                      <li><a href="#">Terms and Conditions</a></li>
                  </ul>
              </div>
      </footer>
    </div>
  );
};

export default LandingPage;