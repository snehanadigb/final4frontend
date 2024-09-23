import React, { useState } from 'react';
import axios from 'axios';
import './AddPlan.css'; // Enhanced styles in CSS

const AddPlan = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [planType, setPlanType] = useState('');
  const [servicesIncluded, setServicesIncluded] = useState({
    fiberLandline: { speed: '', calls: '' },
    dth: { value: '' },
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (!name) formErrors.name = 'Plan Name is required';
    if (!description) formErrors.description = 'Description is required';
    if (!price || isNaN(price) || price <= 0) formErrors.price = 'Enter a valid price';
    if (!planType) formErrors.planType = 'Please select a plan type';
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        await axios.post('http://localhost:5004/services/plans', { name, description, price, servicesIncluded, planType });
        alert('Plan added successfully!');
        setName(''); setDescription(''); setPrice(''); setPlanType('');
        setServicesIncluded({ fiberLandline: { speed: '', calls: '' }, dth: { value: '' } });
        setErrors({});
      } catch (error) {
        alert('Failed to add plan');
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="container">
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Plan Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter plan name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`textarea ${errors.description ? 'input-error' : ''}`}
            placeholder="Enter plan description"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`input ${errors.price ? 'input-error' : ''}`}
            placeholder="Enter plan price"
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>Plan Type</label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className={`select ${errors.planType ? 'input-error' : ''}`}
          >
            <option value="">Select Type</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
          </select>
          {errors.planType && <span className="error-message">{errors.planType}</span>}
        </div>

        {/* <h2 className="subtitle">Services Included</h2>
        <div className="form-group">
          <label>Fiber + Landline Speed</label>
          <input
            type="text"
            value={servicesIncluded.fiberLandline.speed}
            onChange={(e) => setServicesIncluded({ ...servicesIncluded, fiberLandline: { ...servicesIncluded.fiberLandline, speed: e.target.value } })}
            className="input"
            placeholder="Enter speed"
          />
        </div>
        <div className="form-group">
          <label>Unlimited Calls</label>
          <input
            type="text"
            value={servicesIncluded.fiberLandline.calls}
            onChange={(e) => setServicesIncluded({ ...servicesIncluded, fiberLandline: { ...servicesIncluded.fiberLandline, calls: e.target.value } })}
            className="input"
            placeholder="Enter call option"
          />
        </div>
        <div className="form-group">
          <label>DTH Value</label>
          <input
            type="text"
            value={servicesIncluded.dth.value}
            onChange={(e) => setServicesIncluded({ ...servicesIncluded, dth: { value: e.target.value } })}
            className="input"
            placeholder="Enter DTH value"
          />
        </div> */}

        <button type="submit" className="submit-btn">Add Plan</button>
      </form>
    </div>
  );
};

export default AddPlan;
