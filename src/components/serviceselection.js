import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './Copy of T.png';
import './ServiceSelection.css'; // Updated CSS

const ServiceSelection = () => {
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [serviceType, setServiceType] = useState('All');
  const [plans, setPlans] = useState([]);
  const [step, setStep] = useState(4)
  const [filteredPlans, setFilteredPlans] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:5004/services/getplans');
        setPlans(response.data);
        setFilteredPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();

    const savedPlanId = localStorage.getItem('selectedPlanId');
    if (savedPlanId) {
      setSelectedPlanId(parseInt(savedPlanId));
    }
  }, []);

  useEffect(() => {
    if (serviceType === 'All') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(plan => plan.planType === serviceType));
    }
  }, [serviceType, plans]);

  const handleServiceSelection = (planId, planName) => {
    setSelectedPlanId(planId);
    localStorage.setItem('selectedPlanId', planId);
    localStorage.setItem('selectedName', planName);
  };

  const confirmServiceSelection = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      const name = localStorage.getItem('selectedName');
      const token = localStorage.getItem('authToken');
      setSelectedPlanId(localStorage.getItem('selectPlanId'));

      await axios.post(
        'http://localhost:5004/services/select-service',
        {
          planId: selectedPlanId,
          customerId: parseInt(customerId),
          name: name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Service with Plan ID '${name}' selected successfully!`);
      localStorage.removeItem('customerEmail');
      localStorage.removeItem('authToken');
      localStorage.removeItem('selectedName');
      navigate('/thank-you');
    } catch (error) {
      alert('There was an error selecting the service.');
    }
  };

  const handleHomeClick = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('planId');
    localStorage.removeItem('authToken');
    navigate('/landing-page');
  };

  return (
    <div className="container">
      <div className='first'>
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="IndiTel Logo" className="logo-image" />
          <h1 className="company-name">Welcome to IndiTel</h1>
        </div>
        <button className="home1-button" onClick={handleHomeClick}>
          Home
        </button>
      </header>
      </div>
      
    <div className='service-conatiner'>
      {/* Dropdown for filtering between Prepaid, Postpaid, and All */}
      <select
        className="modern-select"
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Prepaid">Prepaid</option>
        <option value="Postpaid">Postpaid</option>
      </select>

      <div className="services-grid">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`service-box ${selectedPlanId === plan.id ? 'service-box-selected' : ''}`}
              onClick={() => handleServiceSelection(plan.id, plan.name)}
            >
              <h2 className="service-title">{plan.name}</h2>
              <p className="service-description">{plan.description}</p>
              <p className="service-price">Price: ₹{plan.price}</p>
              <div className="services-included">
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
              </div>
              {selectedPlanId === plan.id && <span className="tick-mark">✔</span>}
            </div>
          ))
        ) : (
          <p>No plans available.</p>
        )}
      </div>

      {selectedPlanId && (
        <button className="confirm-button" onClick={confirmServiceSelection}>
          Confirm Selection
        </button>
      )}
    </div>
    </div>
  );
};

export default ServiceSelection;