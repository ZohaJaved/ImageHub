import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/');
  }, [navigate]);

  return null; // This component doesn't need to render anything
};

export default Logout;
