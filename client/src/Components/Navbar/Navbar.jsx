import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

function Navbar({ showExtraLinks }) {
  return (
    <nav className="navbar">
      <div className="navbar-heading">ImageHub</div>
      <ul className="navbar-list">
        {showExtraLinks && (
          <>
            <li className="navbar-item"><Link to="/dashboard">Dashboard</Link></li>
            <li className="navbar-item"><Link to="/uploadImage">Upload Image</Link></li>
            <li className="navbar-item"><Link to="/imageGallery">Image Gallery</Link></li>
            <li className="navbar-item"><Link to="/logout">Log Out</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
