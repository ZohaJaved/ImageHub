import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function Dashboard(props) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserDetails(JSON.parse(user));
    }
  }, []);

  const location = useLocation();
  const email = location.state?.email;

  return (
    <div>
      <Navbar showExtraLinks={true} />
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}><h2>Welcome {userDetails ? userDetails.name : 'Guest'}</h2></div>
    </div>
  );
}

export default Dashboard;

