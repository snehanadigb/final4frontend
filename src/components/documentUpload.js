// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './DocumentUpload.css'; // Import the updated CSS file
// import logo from './Copy of T.png'; // Import the logo for IndiTel

// const DocumentUpload = () => {
//   const [file, setFile] = useState(null);
//   const [filePreviewUrl, setFilePreviewUrl] = useState(null);
//   const [verificationStatus, setVerificationStatus] = useState('');
//   const navigate = useNavigate();
//   const customerId = localStorage.getItem('customerId');
//   const token = localStorage.getItem('authToken');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
    
//     if (selectedFile && selectedFile.type.startsWith('image/')) {
//       setFile(selectedFile);
//       setFilePreviewUrl(URL.createObjectURL(selectedFile));
//     } else {
//       setFile(null);
//       setFilePreviewUrl(null);
//       alert('Please select a valid image file (PNG, JPEG, etc.)');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       alert('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('document', file);
//     try {
//       const response = await axios.post('http://localhost:5004/documents/upload', formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         },
//         params: { customerId }  // Send customer ID with request
//       });

//       setVerificationStatus(response.data.verificationStatus);

//       if (response.data.verificationStatus === 'verified') {
//         alert('Document Verified Successfully');
//         navigate('/select-service');
//       } else {
//         alert('Verification failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error during document upload:', error);
//       alert('Document verification failed. Please try again.');
//     }
//   };

//   const handleHomeClick = () => {
//     navigate('/landing-page');
//   };

//   return (
//     <div className="document-upload-container">
//       <header className="document-upload-header">
//         <div className="logo">
//           <img src={logo} alt="IndiTel Logo" className="logo-image" />
//           <h1 className="company-name">Welcome to IndiTel</h1>
//         </div>
//         <button className="home-button" onClick={handleHomeClick}>
//           Home
//         </button>
//       </header>
//       <div className="upload-container">
//         <form className="upload-form" onSubmit={handleSubmit}>
//           <h2 className="upload-title">Upload Your Document</h2>
//           <div className="file-input-container">
//             <input
//               type="file"
//               className="file-input"
//               onChange={handleFileChange}
//               accept="image/*" // Restrict file types to images only
//               required
//             />
//           </div>
//           {/* File Preview */}
//           {filePreviewUrl && (
//             <div className="file-preview-container">
//               <h4>Preview:</h4>
//               <img src={filePreviewUrl} alt="File Preview" className="file-preview-image" />
//             </div>
//           )}
//           <button type="submit" className="upload-button">
//             Upload
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DocumentUpload;
// New code
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DocumentUpload.css'; // Import the updated CSS file
import logo from './Copy of T.png'; 
import img from './2.png'// Import the logo for IndiTel

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const navigate = useNavigate();
  const customerId = localStorage.getItem('customerId');
  const token = localStorage.getItem('authToken');
  const [step, setStep] = useState(3)
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setFilePreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setFilePreviewUrl(null);
      alert('Please select a valid image file (PNG, JPEG, etc.)');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFilePreviewUrl(URL.createObjectURL(droppedFile)); // Show preview of the dropped file
    }
  };

  const handleClick = () => {
    document.getElementById('fileInput').click(); // Programmatically click hidden file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_PORT}/documents/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        params: { customerId }  // Send customer ID with request
      });

      setVerificationStatus(response.data.verificationStatus);

      if (response.data.verificationStatus === 'verified') {
        alert('Document Verified Successfully');
        navigate('/select-service');
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during document upload:', error);
      alert('Document verification failed. Please try again.');
    }
    finally {
      setLoading(false); // End loading after the request is complete
    }
  };

  const handleHomeClick = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('authToken');
    navigate('/landing-page');
  };

  return (
    <div className={`register-container ${loading ? 'blur' : ''}`}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
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
        <img className="img" src={img}/>
      </div>

  {/* <div className="progress-bar-wrapper">
    <div className="progress-bar">
      <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
    </div>
    <div className="step-label">Step {step} of 4</div>
  </div> */}

  <div className="register-right">
    <form
      className="upload-form"
      onSubmit={handleSubmit}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="upload-title">Upload Your Document</h2>

      <div
            className="drag-drop-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleClick} // Trigger file select on click
            style={{ cursor: 'pointer', border: '2px dashed #00a8e8', padding: '20px' }}
          >
            <p>Drag and Drop your files here, or click to select</p>
            <input
              id="fileInput"
              type="file"
              className="file-input"
              onChange={handleFileChange}
              accept="image/*"
              required
              style={{ display: 'none' }} // Hide the file input
            />
          </div>

      {filePreviewUrl && (
        <div className="file-preview-container">
          <h4>Preview:</h4>
          <img src={filePreviewUrl} alt="File Preview" className="file-preview-image" />
        </div>
      )}

      <button type="submit" className="upload-button">
        Upload
      </button>
    </form>
  </div>
</div>

  );
};

export default DocumentUpload;