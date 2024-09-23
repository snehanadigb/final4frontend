import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customerId, setId] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('Not Uploaded');
  const customeremail = localStorage.getItem('customerEmail');
  const token = localStorage.getItem('authToken');
  const [alertMessage, setAlertMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [hasService, setHasService] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const onboardingSteps = [
    { label: 'Registration', completed: true },
    { label: 'Document Verification', completed: verificationStatus === 'Verified' },
    { label: 'Service Selection', completed: hasService },
    { label: 'Service Activation', completed: customerDetails && customerDetails.services.some(service => service.isActive) },
  ];

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/customers/email/${customeremail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const customer = response.data;
        setCustomerDetails(customer);
        setId(customer.id);

        if (customer.documents && customer.documents.length > 0) {
          const isAnyDocumentVerified = customer.documents.some(doc => doc.verificationStatus === 'Verified');
          setVerificationStatus(isAnyDocumentVerified ? 'Verified' : 'Not Uploaded');
        }

        if (customer.services && customer.services.length > 0) {
          setHasService(true);
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerDetails();
  }, [customeremail, token]);

  const handleLogout = () => {
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('authToken');
    window.location.href = '/landing-page';
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();

    if (!documentFile) {
      setErrorMessage('Please select a document to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('document', documentFile);

    try {
      await axios.post(`http://localhost:5004/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        params: { customerId }
      }, );

      setAlertMessage('Document uploaded successfully!');
      setVerificationStatus('Verified');
      setDocumentFile(null);
      setHasService(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      setErrorMessage('There was an error uploading the document.');
    }
  };

  const handleServiceSelection = () => {
    localStorage.setItem('customerId', customerId);
    navigate('/select-service');
  };

  const handleViewPlanDetails = async (planId) => {
    console.log(planId);
    try {
      const response = await axios.get(`http://localhost:5004/services/getplans/${planId}`, 
        {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
      setPlanDetails(response.data);
      setShowModal(true);
      
    } catch (error) {
      console.error('Error fetching plan details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPlanDetails(null);
  };

  const getProgressPercentage = () => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length;
    return (completedSteps / onboardingSteps.length) * 100;
  };

  const renderStepIndicator = () => {
    return (
      <div className="d-flex justify-content-between mb-3">
        {onboardingSteps.map((step, index) => (
          <div key={index} className={`step ${step.completed ? 'completed' : ''}`}>
            <div className={`step-circle ${step.completed ? 'completed' : ''}`}>{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setDocumentFile(file);
      setErrorMessage('');
    } else {
      setErrorMessage('Please upload a valid image file.');
      setDocumentFile(null);
    }
  };

  const renderImagePreview = () => {
    if (documentFile) {
      const imageUrl = URL.createObjectURL(documentFile);
      return <img src={imageUrl} alt="Preview" className="img-preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />;
    }
    return null;
  };

  if (!customerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div className="container-fluid">
          <div className="ml-auto d-flex">
            <span className="navbar-text text-white mr-3">Welcome, {customerDetails.first_name}</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="mb-4">
        {renderStepIndicator()}
        <div className="progress" style={{ height: '30px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${getProgressPercentage()}%`, backgroundColor: '#007bff' }}
            aria-valuenow={getProgressPercentage()}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {`${getProgressPercentage().toFixed(0)}% Completed`}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Customer Details</h4>
            </div>
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{customerDetails.first_name} {customerDetails.last_name}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{customerDetails.email}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>{customerDetails.phone_no}</td>
                  </tr>
                  {hasService && customerDetails.services.map((service) => (
                    <tr key={service.id}>
                      <td>Service</td>
                      <td>{service.name}</td>
                      <td>Status: {service.isActive ? 'Active' : 'Inactive'}</td>
                      <td>
                        <button className="btn btn-info" onClick={() => handleViewPlanDetails(service.planId)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h4>Document Upload</h4>
            </div>
            <div className="card-body">
              {verificationStatus === 'Verified' ? (
                <>
                  <div className="alert alert-success">Your document is verified!</div>
                  {!hasService && (
                    <button className="btn btn-info" onClick={handleServiceSelection}>
                      Proceed to Service Selection
                    </button>
                  )}
                </>
              ) : verificationStatus === 'Pending' ? (
                <div className="alert alert-warning">Your document is currently being verified.</div>
              ) : (
                <form onSubmit={handleDocumentUpload}>
                  <div className="mb-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      required 
                    />
                  </div>
                  {renderImagePreview()}
                  <button type="submit" className="btn btn-primary">Upload Document</button>
                  {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
                  {alertMessage && <div className="alert alert-info mt-2">{alertMessage}</div>}
                </form>
              )}
              {verificationStatus && <p className="mt-3">Verification Status: <strong>{verificationStatus}</strong></p>}
            </div>
          </div>
        </div>
        </div>
      

        {showModal && (
  <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Plan Details</h5>
          
        </div>
        <div className="modal-body">
          {planDetails ? (
            <>
              <p><strong>Plan Name:</strong> {planDetails.name}</p>
              <p><strong>Description:</strong> {planDetails.description}</p>
              <p><strong>Price:</strong> {planDetails.price}</p>
            </>
          ) : (
            <div>Loading plan details...</div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

  
    </div>
  );
};

export default CustomerDashboard;
