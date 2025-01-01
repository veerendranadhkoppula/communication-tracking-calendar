import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardTable = () => {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newCommunication, setNewCommunication] = useState({
    type: '',
    date: '',
    notes: '',
  });

  // Fetch companies when the component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Handle opening the modal
  const handleOpenModal = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedCompany(null);
    setShowModal(false);
    setNewCommunication({ type: '', date: '', notes: '' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunication((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedCompany);
  
    if (selectedCompany) {
      // Prepare the communication data to append
      const communicationData = {
        type: newCommunication.type,
        date: newCommunication.date,
        notes: newCommunication.notes,
        companyId: selectedCompany.id, // Include company ID
        companyName: selectedCompany.name, // Include company name
      };
  
      // Append the new communication directly to the selected company's lastCommunications
      const updatedCompanies = companies.map((company) =>
        company.id === selectedCompany.id
          ? {
              ...company,
              lastCommunications: [
                ...company.lastCommunications, // Keep existing communications
                communicationData, // Append the new communication
              ],
            }
          : company
      );
  
      // Update the companies state with the new communication
      setCompanies(updatedCompanies);
      
      // Close the modal after submission (if applicable)
      handleCloseModal();
    }
  };
  
  // Function to get the color class based on the scheduled date
  const getColorClass = (date) => {
    const now = new Date();
    const scheduledDate = new Date(date);

    if (scheduledDate < now) return 'bg-red-100'; // Overdue
    if (scheduledDate.toDateString() === now.toDateString()) return 'bg-yellow-100'; // Due today
    return 'bg-green-100'; // Upcoming
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <table className="min-w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border p-2">Company Name</th>
            <th className="border p-2">Last Five Communications</th>
            <th className="border p-2">Next Scheduled Communication</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className={getColorClass(company.nextCommunication)}>
              <td className="border p-2">{company.name}</td>
              <td className="border p-2">
                {(company.lastCommunications || []).map((comm, index) => (
                  <div key={index}>
                    <strong>{comm.type}</strong> ({comm.date}) - {comm.notes}
                  </div>
                ))}
              </td>
              <td className="border p-2">{company.nextCommunication || 'Not Scheduled'}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleOpenModal(company)}
                >
                  Add Communication
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Log New Communication</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-bold mb-2">Type of Communication</label>
                <select
                  name="type"
                  value={newCommunication.type}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  required
                >
                  <option value="">Select</option>
                  <option value="Email">Email</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="LinkedIn Message">LinkedIn Message</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Date of Communication</label>
                <input
                  type="date"
                  name="date"
                  value={newCommunication.date}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Add Notes</label>
                <textarea
                  name="notes"
                  value={newCommunication.notes}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  placeholder="Enter any additional comments"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 p-2 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;
