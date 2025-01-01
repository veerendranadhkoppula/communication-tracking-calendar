import React, { useState, useEffect } from 'react';
import {
  addCommunicationMethod,
  updateCommunicationMethod,
} from '../services/api';

const CommunicationMethodForm = ({ onClose, fetchMethods, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    mandatory: false,
    sequence: '',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const methodData = {
      name: formData.name,
      mandatory: formData.mandatory,
      sequence: formData.sequence,
    };
  
    if (initialData) {
      // Update method with selected data
      await updateCommunicationMethod(initialData.id, methodData);
    } else {
      // Add new communication method
      await addCommunicationMethod(methodData);
    }
  
    fetchMethods();
    onClose();
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl font-bold">
          {initialData ? 'Edit Communication Method' : 'Add Communication Method'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Method Name"
            className="border p-2 w-full mb-2"
          />
          <div className="mb-2 flex items-center">
            <label htmlFor="mandatory" className="mr-2">
              Mandatory:
            </label>
            <input
              type="checkbox"
              name="mandatory"
              id="mandatory"
              checked={formData.mandatory}
              onChange={handleChange}
            />
          </div>
          <input
            type="number"
            name="sequence"
            value={formData.sequence}
            onChange={handleChange}
            placeholder="Sequence"
            className="border p-2 w-full mb-2"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunicationMethodForm;
