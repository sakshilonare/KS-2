import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminNav = () => {
    const navigate = useNavigate();
    const [showLogoutScreen, setShowLogoutScreen] = useState(false);

    const handleLogout = () => {
        // Remove user-related data from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');

        // Show logout confirmation message
        setShowLogoutScreen(true);
        toast.success('You have successfully logged out');

        // Redirect to home page after a short delay
        setTimeout(() => {
            setShowLogoutScreen(false);  // Hide logout screen
            navigate('/', { replace: true }); // Navigate to home
        }, 3000); // 3-second delay
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
        <nav className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <ul className="flex space-x-6">
                    <li>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="hover:text-gray-300"
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/admin/paymentproofs')}
                            className="hover:text-gray-300"
                        >
                            Manage Payments
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/admin/manage-crops')}
                            className="hover:text-gray-300"
                        >
                            Manage Crops
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate('/admin/manage-users')}
                            className="hover:text-gray-300"
                        >
                            Block/Unblock Users
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="hover:text-gray-300 focus:outline-none"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
            <Outlet />
        </nav>
    );
};

export default AdminNav;
