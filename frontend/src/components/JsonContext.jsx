import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const JsonContext = createContext();

// Create provider component
export const JsonProvider = ({ children }) => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch JSON data from the server when the provider is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/read-json');
        setJsonData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to update the JSON both locally and on S3
  const updateJson = async (updatedData) => {
    try {
      setJsonData(updatedData); // Update the JSON locally

      // Upload the updated JSON to S3 via the backend
      await axios.put('http://localhost:3001/read-json', updatedData);

      console.log('JSON updated successfully');
    } catch (error) {
      console.error('Error updating JSON:', error);
      setError('Error updating JSON');
    }
  };

  return (
    <JsonContext.Provider value={{ jsonData, loading, error, updateJson }}>
      {children}
    </JsonContext.Provider>
  );
};
