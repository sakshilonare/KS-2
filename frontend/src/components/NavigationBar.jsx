import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {
  const handleLogout = () => {
    // Add logout logic here
  };

  return (
    <header className="bg-green-700 text-white py-4 fixed top-0 left-0 w-full z-20">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">Krishi-Sahyog</h1>
        <nav>
          <ul className="flex space-x-5 gap-3 text-lg">
            <li><Link to="/" className="hover:text-green-200 font-semibold">Home</Link></li>
            <li><Link to="/login" className="hover:green-blue-200 font-semibold">Login</Link></li>
            <li><Link to="/registration" className="hover:text-green-200 font-semibold">Register</Link></li>
            <li><Link to="/feedback" className="hover:text-green-200 font-semibold">Feedback</Link></li>
            {/* <li><Link to="/cropform" className="hover:text-green-200 font-semibold">Crop From</Link></li> */}

            <li><button onClick={handleLogout} className="hover:text-green-200"><FontAwesomeIcon icon={faSignOutAlt} /></button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
