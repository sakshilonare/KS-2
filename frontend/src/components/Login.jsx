import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast'; // Ensure you have this package installed
import NavigationBar from './NavigationBar'; // Adjust this import based on your file structure
import axios from 'axios'; // Import axios here
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import toast from 'react-hot-toast'; // Assuming you're using react-hot-toast

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('farmer'); // Default role
    const [loginChk, setLoginChk] = useState(0); // Assuming this tracks failed attempts

    const navigate = useNavigate(); // Use the hook at the top of the component

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        try {
            console.log("Selected Role:", selectedRole);

            const response = await axios.post(`http://localhost:3000/api/${selectedRole}/login`, {
                email,
                password,
                role: selectedRole, // Include role in the request body
            }, { withCredentials: true }); // Include credentials for cookie-based auth

            // console.log('Email:', email, 'Password:', password, 'Role:', selectedRole);

            if (response.data.success) {
                toast.success('Login successful!');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({ email, role: selectedRole }));

                // Redirect based on role
                if (selectedRole === 'farmer') {
                    navigate('/farmer/all-crops');
                } else if (selectedRole === 'buyer') {
                    navigate('/buyer/all-crops');
                } else if (selectedRole === 'admin') {
                    navigate('/admin/dashboard');
                }
            } else {
                // Login failed
                toast.error('Invalid credentials, please try again.');
            }
        } catch (error) {
            // Handle error (e.g., network error, server error)
            console.error('Login error:', error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <>
            <NavigationBar />
            <Toaster position="top-center" />
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    backgroundImage: "url('./farmer.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(20%)"
                }}
            >
                <div className="max-w-md w-full h-full ml-2 mt-10 space-y-8 bg-white bg-opacity-60 p-8 rounded-md shadow-md">
                    <div>
                        <h2 className="mt-7 text-center text-3xl font-extrabold text-gray-900">
                            Welcome to Login
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email" // Changed to email type for better validation
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="sr-only">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 mb-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                >
                                    <option value="farmer">Farmer</option>
                                    <option value="admin">Admin</option>
                                    <option value="buyer">Buyer</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-700 hover:text-green-900">
                                    Forgot your password?
                                </a>
                            </div>
                            <div className="text-sm">
                                <a href="/registration" className="font-medium text-green-700 hover:text-green-900">
                                    Don't have an account?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-green-700 disabled:opacity-50"
                                disabled={loginChk >= 5}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
