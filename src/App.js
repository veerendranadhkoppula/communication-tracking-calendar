import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Import Tailwind styles if applicable
import axios from 'axios'; // Axios for API calls
import CompanyList from './components/Admin/CompanyList';
import CommunicationMethodList from './components/Admin/CommunicationMethodList';
import DashboardTable from './components/Users/DashboardTable';
import CalendarView from './components/Users/CalendarView';
import NotificationPanel from './components/Users/NotificationPanel';  // Imported NotificationPanel
import ReportingPage from './components/Reporting/ReportingPage';
import CommunicationModel from './components/Users/CommunicationModel';

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [companies, setCompanies] = useState([]); // State to store the companies data
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Function to fetch the companies data from the API
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/companies');
        setCompanies(response.data); // Set companies data in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false); // Handle error and stop loading
      }
    };

    fetchCompanies(); // Call the fetch function
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }
  return ( 
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="bg-gray-800 p-4 text-white">
          <div className="container mx-auto">
            <ul className="flex justify-around">
              <li><a href="/admin/companies">Companies</a></li>
              <li><a href="/admin/communication-methods">Communication Methods</a></li>
              <li><a href="/user/dashboard">Dashboard</a></li>
              <li><a href="/user/notifications">Notifications</a></li>
              <li><a href="/user/calendar">Calendar</a></li>
              <li><a href="/reports">Reports</a></li>
            </ul>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/companies" element={<CompanyList />} />
          <Route path="/admin/communication-methods" element={<CommunicationMethodList />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<DashboardTable />} />
          <Route
            path="/user/notifications"
            element={<NotificationPanel companies={companies} />} // Pass companies data to NotificationPanel
          />
          <Route path="/user/calendar" element={<CalendarView companies={companies} />} />
          <Route path="/user/communication" element={<CommunicationModel />} />

          {/* Reporting and Analytics Routes */}
          <Route path="/reports" element={<ReportingPage />} />

          {/* Default Route */}
          <Route path="*" element={<h1 className="text-center mt-10">Welcome to the Communication App</h1>} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </Router>
);
};

export default App;
