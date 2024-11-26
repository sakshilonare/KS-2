// FarmerNav.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const FarmerNav = () => {
    const navigate = useNavigate();
    const [showLogoutScreen, setShowLogoutScreen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null); // Manage the dropdown visibility

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        setShowLogoutScreen(true); // Show logout screen
        toast.success('You have successfully logged out'); // Show confirmation

        // Redirect to home page after a delay
        setTimeout(() => {
            setShowLogoutScreen(false);
            navigate('/', { replace: true });
        }, 3000); // 3-second delay
    };

    const toggleDropdown = (menu) => {
        setDropdownOpen(dropdownOpen === menu ? null : menu); // Toggle the selected dropdown
    };

    if (showLogoutScreen) {
        return (
            <div className="flex items-center justify-center h-screen bg-green-100">
                <h2 className="text-2xl font-semibold text-green-700">
                    You have successfully logged out
                </h2>
            </div>
        );
    }

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="bg-green-700 text-white py-4" style={{ zIndex: 2, position: 'relative' }}>
            <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-white font-bold text-lg">Home</Link>
                    <ul className="flex space-x-4 w-150">
                        {/* Dropdown for Add Crop & Create Auction */}
                        <li className="relative">
                            <button
                                onClick={() => toggleDropdown('addCreate')}
                                className="text-white hover:text-gray-300 focus:outline-none"
                            >
                                Add/Create
                            </button>
                            {dropdownOpen === 'addCreate' && (
                                <div className="absolute mt-2 bg-white text-black shadow-lg rounded-lg" style={{ width: '150px' }}>
                                    <Link to="/farmer/add-crop" className="block px-4 py-2 hover:bg-gray-100 ">Add Crop</Link>
                                    <Link to="/farmer/create-auction" className="block px-4 py-2 hover:bg-gray-100">Create Auction</Link>
                                </div>
                            )}
                        </li>

                        {/* Dropdown for All Crops & All Auction */}
                        <li className="relative">
                            <button
                                onClick={() => toggleDropdown('allItems')}
                                className="text-white hover:text-gray-300 focus:outline-none"
                            >
                                All Items
                            </button>
                            {dropdownOpen === 'allItems' && (
                                <div className="absolute mt-2 bg-white text-black shadow-lg rounded-lg " style={{ width: '150px' }}>
                                    <Link to="/farmer/all-crops" className="block px-4 py-2 hover:bg-gray-100">All Crops</Link>
                                    <Link to="/farmer/auction" className="block px-4 py-2 hover:bg-gray-100">All Auction</Link>
                                </div>
                            )}
                        </li>
                        <li> <button
                                className="text-white hover:text-gray-300 focus:outline-none"
                            >
                                <Link to="/farmer/profile">Profile</Link>
                            </button></li>
                        

                        {/* Logout Button */}
                        <li>
                            <button 
                                onClick={handleLogout} 
                                className="text-white hover:text-gray-300 focus:outline-none"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Nested Route Outlet */}
            <Outlet />
        </div>
    );
};

export default FarmerNav;
