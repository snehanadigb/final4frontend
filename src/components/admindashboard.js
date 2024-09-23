import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import logo from './Copy of T.png';
import AddPlan from './AddPlan';
import { Bar } from 'react-chartjs-2';

const AdminDashboard = () => {
    const [pendingCustomers, setPendingCustomers] = useState([]);
    const [verifiedCustomers, setVerifiedCustomers] = useState([]);
    const [activeCustomers, setActiveCustomers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentSection, setCurrentSection] = useState(null);
    const [plans, setPlans] = useState([]);
    const token = localStorage.getItem('token');
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        fetchPendingCustomers();
        fetchVerifiedCustomers();
        fetchActiveCustomers();
        fetchDocumentVerificationLogs();
        fetchPlans();
        fetchStatistics();
    }, []);

    const fetchPendingCustomers = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-pending-customers', {
                params: { search: searchTerm }, // Pass the search term
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingCustomers(response.data);
        } catch (error) {
            console.error('Error fetching pending customers:', error);
        }
    };
    
    const fetchVerifiedCustomers = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-verified-customers', {
                params: { search: searchTerm }, // Pass the search term
                headers: { Authorization: `Bearer ${token}` }
            });
            setVerifiedCustomers(response.data);
        } catch (error) {
            console.error('Error fetching verified customers:', error);
        }
    };
    
    const fetchActiveCustomers = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-activated-customers', {
                params: { search: searchTerm }, // Pass the search term
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveCustomers(response.data);
        } catch (error) {
            console.error('Error fetching activated customers:', error);
        }
    };

    const fetchDocumentVerificationLogs = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-document-verification-logs', {
                params: { search: searchTerm },
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleSearch = () => {
        fetchDocumentVerificationLogs(search);
        fetchPendingCustomers(search);
        fetchActiveCustomers(search);
        fetchVerifiedCustomers(search);

    };
    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:5004/services/getplans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(response.data); // Set plans from API response
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleActivateService = async (serviceId) => {
        // Implement service activation logic
        try {
            await axios.post(`http://localhost:5004/services/activate-service`, { serviceId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Service activated successfully!');
            fetchVerifiedCustomers(); // Refresh the verified customers
            fetchActiveCustomers(); // Refresh the active customers
        } catch (error) {
            console.error('Error activating service:', error);
            alert('Failed to activate service.');
        }
    };

    
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('http://localhost:5004/services/statistics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
    
        const chartData = {
            labels: ['Prepaid', 'Postpaid'],
            datasets: [
                {
                    label: 'Plan Counts',
                    data: [statistics.prepaidCount, statistics.postpaidCount],
                    backgroundColor: ['#4CAF50', '#2196F3'],
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        };
    
        const customerStatusData = {
            labels: ['Verified', 'Pending', 'Activated'],
            datasets: [
                {
                    label: 'Customer Status',
                    data: [statistics.verifiedCount, statistics.pendingCount, statistics.activatedCount],
                    backgroundColor: ['#FF9800', '#FF5722', '#8BC34A'],
                    borderColor: '#fff',
                    borderWidth: 1,
                },
            ],
        }
    return (
        <div className="dashboard-container">
            <nav className="admin-navbar">
                <div className="navbar-left">
                    <img src={logo} alt="Logo" className="logo" />
                    <span className="admin-name">Welcome, Admin</span>
                </div>
                <div className="navbar-right">
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/landing-page'; }}>Logout</button>
                </div>
            </nav>

            <nav className="submenu-navbar">
            <button onClick={() => setCurrentSection('dashboard')}>Dashboard</button>
                <button onClick={() => setCurrentSection('pending')}>Pending Customers</button>
                <button onClick={() => setCurrentSection('verified')}>Verified Customers</button>
                <button onClick={() => setCurrentSection('activated')}>Activated Customers</button>
                <button onClick={() => setCurrentSection('logs')}>Document Verification Logs</button>
                <button onClick={() => setCurrentSection('viewPlans')}>View Plans</button> {/* Button for View Plans */}
                <button onClick={() => window.location.href = '/admin-register'}>Register New Admin</button>
            </nav>
            {currentSection === 'dashboard' &&  (
                <div className="dashboard-content">
                    <h2>Statistics Overview</h2>
                    <div className="charts-container">
                        <div className="chart">
                            <h3>Plan Type Distribution</h3>
                            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                        </div>
                        <div className="chart">
                            <h3>Customer Status Comparison</h3>
                            <Bar data={customerStatusData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            )}
            {currentSection!=='dashboard' &&  currentSection !== 'viewPlans' && currentSection!=='addPlan' &&(
                     <div className="search-bar">
                     <input
                         type="text"
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         placeholder="Search by Name"
                     />
                     <button onClick={handleSearch}>Search</button>
                 </div>
)}

            {/* Conditional rendering based on the currentSection state */}
            {currentSection === 'pending' && <CustomerTable customers={pendingCustomers} status="Pending" />}
            {currentSection === 'verified' && <CustomerTable customers={verifiedCustomers} status="Verified" onActivate={handleActivateService} />}
            {currentSection === 'activated' && <CustomerTable customers={activeCustomers} status="Active" />}
            {currentSection === 'logs' && (
    <div className="dashboard-section">
        <h2>Document Verification Logs</h2>
        <table className="customer-table"> {/* Reuse customer-table styling */}
            <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Verification Status</th>
                    <th>Verification Date</th>
                </tr>
            </thead>
            <tbody>
                {logs.length > 0 ? (
                    logs.map(log => (
                        <tr key={log.id}>
                            <td>{log.customer.id}</td>
                            <td>{`${log.customer.first_name} ${log.customer.last_name}`}</td>
                            <td>{log.verificationStatus}</td>
                            <td>{log.verificationDate ? new Date(log.verificationDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No logs found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
)}

{currentSection === 'viewPlans' && (
    <div className="dashboard-section"> {/* Ensure same styling as customer-table */}
        
        
        <table className="customer-table"> {/* Reuse customer-table styling */}
            <thead>
                <tr>
                    <th>Plan Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <tr key={plan.id}>
                            <td>{plan.name}</td>
                            <td>{plan.description}</td>
                            <td>{plan.price}</td>
                            <td>{plan.planType}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No plans found.</td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="add-plan-container">
  <button onClick={() => setCurrentSection('addPlan')} className="add-plan-btn">
    Add Plan
  </button>
</div>

    </div>
)}

            {currentSection === 'addPlan' && <AddPlan />} {/* Render AddPlan component */}
        </div>
    );
};

const CustomerTable = ({ customers, status, onActivate }) => {
    return (
        <div className="dashboard-section">
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Document Status</th>
                        <th>Requested Service</th>
                        <th>Service Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.documents.map(doc => doc.verificationStatus).join(', ')}</td>
                                <td>{customer.services && customer.services.length > 0
                                        ? customer.services.map(service => service.name).join(', ')
                                        : 'No services requested'}</td>
                                <td>
                                {customer.services && customer.services.length > 0
                                        ? customer.services.map(service => (
                                            <span key={service.id}>
                                                {service.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        ))
                                        : 'N/A'}
                                </td>
                                <td>
                                {customer.services && customer.services.some(service => !service.isActive) ? (
                                        customer.services
                                            .filter(service => !service.isActive)
                                            .map(service => (
                                                <button
                                                    className="activate-btn"
                                                    key={service.id}
                                                    onClick={() => onActivate(service.id)}
                                                >
                                                    Activate Service
                                                </button>
                                            ))
                                    ) : (
                                        'No actions available'
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
