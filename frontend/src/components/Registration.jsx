import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";

const Registration = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('admin');
    const [adminFormData, setAdminFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        password: '',
        role: 'admin', // Assuming default role is admin
    });
    const [farmerFormData, setFarmerFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        farmAddress: '',
        farmSize: '',
        farmingType: '',
        farmingExperience: '',
        farmingPracticesDescription: '',
        State: '',
        Region:'',
        role: 'farmer', // Assuming default role is farmer
    });
    const [buyerFormData, setBuyerFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        password: '',
        role: 'buyer', // Assuming default role is buyer
    });

    // Switch between tabs for Admin, Farmer, and Buyer registration
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Handle Admin Registration form submission
    const handleAdminRegistration = async (e) => {
        e.preventDefault();
        console.log(e);
        try {
            const response = await axios.post("http://localhost:3000/api/admin/signup", adminFormData);
            navigate('/login');
            console.log("Admin registration successful:", response.data);
            toast.success(response.data.message || "Registered successfully!");
            setAdminFormData({
                name: '',
                mobile: '',
                email: '',
                address: '',
                password: '',
                role: 'admin', // Assuming default role is admin
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to register");        
        }
    };

    // Handle Farmer Registration form submission
  const handleFarmerRegistration = async (e) => {
    e.preventDefault();
    console.log("Submitting farmer data:", farmerFormData); // Check the form data
    try {
        const response = await axios.post("http://localhost:3000/api/farmer/signup", farmerFormData);
        navigate('/login');
        console.log("Farmer registration successful:", response.data);
        toast.success(response.data.message || "Registered successfully!");
        setFarmerFormData({ // Reset form data
            name: '',
            email: '',
            mobile: '',
            dateOfBirth: '',
            gender: '',
            password: '',
            farmAddress: '',
            farmSize: '',
            farmingType: '',
            farmingExperience: '',
            farmingPracticesDescription: '',
            State: '',
            Region: '',
            role: 'farmer', 
        });
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to register");    
    }
};


    // Handle Buyer Registration form submission
    const handleBuyerRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/buyer/signup", buyerFormData);
            navigate('/login');
            console.log("Buyer registration successful:", response.data);
            toast.success(response.data.message || "Registered successfully!");
           setBuyerFormData({
                name: '',
                mobile: '',
                email: '',
                address: '',
                password: '',
                role: 'buyer', // Assuming default role is buyer
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to register");
        }
    };

    // Handle input changes for the form (Admin, Farmer, Buyer)
    const handleInputChange = (e, formDataSetter) => {
        const { name, value } = e.target;
        formDataSetter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    

   return (
        <>
            <NavigationBar />
            <Toaster position="top-center" />
            <div className="flex justify-center items-center min-h-screen bg-cover bg-gray-200 mt-16 overscroll-none" style={{ backgroundImage: "url('./farmer.webp')", backgroundSize: 'cover', backgroundAttachment: 'fixed'  }}>
    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl mx-4 relative " style={{ height: '80vh', overflowY: 'auto' }}>
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">Welcome to Registration</h2>
                    <div className="flex justify-around mb-6">
                        <button
                            className={`px-6 py-3 rounded-md text-lg font-semibold ${activeTab === 'admin' ? 'bg-green-600 text-white' : 'text-green-600'}`}
                            onClick={() => handleTabChange('admin')}
                        >
                            Admin
                        </button>
                        <button
                            className={`px-6 py-3 rounded-md text-lg font-semibold ${activeTab === 'farmer' ? 'bg-green-600 text-white' : 'text-green-600'}`}
                            onClick={() => handleTabChange('farmer')}
                        >
                            Farmer
                        </button>
                        <button
                            className={`px-6 py-3 rounded-md text-lg font-semibold ${activeTab === 'buyer' ? 'bg-green-600 text-white' : 'text-green-600'}`}
                            onClick={() => handleTabChange('buyer')}
                        >
                            Buyer
                        </button>
                    </div>

                    {activeTab === 'admin' && (
    <form className="space-y-6 p-6 border rounded-lg shadow-lg bg-white" onSubmit={handleAdminRegistration}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={adminFormData.name}
                    onChange={(e) => handleInputChange(e, setAdminFormData)}
                    required
                    placeholder="Enter your name"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="mobile" className="block mb-1 font-medium text-gray-700">Mobile Number:</label>
                <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={adminFormData.mobile}
                    onChange={(e) => handleInputChange(e, setAdminFormData)}
                    required
                    placeholder="Enter mobile number"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email Address:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={adminFormData.email}
                    onChange={(e) => handleInputChange(e, setAdminFormData)}
                    required
                    placeholder="Enter your email"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="address" className="block mb-1 font-medium text-gray-700">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={adminFormData.address}
                    onChange={(e) => handleInputChange(e, setAdminFormData)}
                    required
                    placeholder="Enter your address"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={adminFormData.password}
                    onChange={(e) => handleInputChange(e, setAdminFormData)}
                    required
                    placeholder="Enter a secure password"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Role:</label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={adminFormData.role}
                    onChange={handleInputChange}
                    disabled // Predefined as 'admin'
                    className="input-field border rounded-md py-2 px-3 w-full bg-gray-100 cursor-not-allowed"
                />
            </div>
        </div>

        <button type="submit" className="btn-submit bg-green-600 text-white hover:bg-green-700 transition duration-200 w-full py-2 rounded-md shadow-md">
            Register as Admin
        </button>
    </form>
)}



  {activeTab === 'farmer' && (
    <form className="space-y-6 p-6 border rounded-lg shadow-lg bg-white" onSubmit={handleFarmerRegistration}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={farmerFormData.name}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter your name"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={farmerFormData.email}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter your email"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="mobile" className="block mb-1 font-medium text-gray-700">Mobile Number:</label>
                <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={farmerFormData.mobile}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Mobile Number"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="dateOfBirth" className="block mb-1 font-medium text-gray-700">Date of Birth:</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={farmerFormData.dateOfBirth}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">Gender:</label>
                <select
                    id="gender"
                    name="gender"
                    value={farmerFormData.gender}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={farmerFormData.password}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter a secure password"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="farmAddress" className="block mb-1 font-medium text-gray-700">Farm Address:</label>
                <input
                    type="text"
                    id="farmAddress"
                    name="farmAddress"
                    value={farmerFormData.farmAddress}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter your farm address"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="farmSize" className="block mb-1 font-medium text-gray-700">Farm Size (in acres):</label>
                <input
                    type="text"
                    id="farmSize"
                    name="farmSize"
                    value={farmerFormData.farmSize}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter farm size in acres"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="farmingType" className="block mb-1 font-medium text-gray-700">Farming Type:</label>
                <input
                    type="text"
                    id="farmingType"
                    name="farmingType"
                    value={farmerFormData.farmingType}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter type of farming"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="farmingExperience" className="block mb-1 font-medium text-gray-700">Farming Experience (in years):</label>
                <input
                    type="text"
                    id="farmingExperience"
                    name="farmingExperience"
                    value={farmerFormData.farmingExperience}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter years of experience"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="farmingPracticesDescription" className="block mb-1 font-medium text-gray-700">Farming Practices Description:</label>
                <textarea
                    id="farmingPracticesDescription"
                    name="farmingPracticesDescription"
                    value={farmerFormData.farmingPracticesDescription}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Describe your farming practices"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="State" className="block mb-1 font-medium text-gray-700">State:</label>
                <input
                    type="text"
                    id="State"
                    name="State"
                    value={farmerFormData.State}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter your state"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="Region" className="block mb-1 font-medium text-gray-700">Region:</label>
                <input
                    type="text"
                    id="Region"
                    name="Region"
                    value={farmerFormData.Region}
                    onChange={(e) => handleInputChange(e, setFarmerFormData)}
                    required
                    placeholder="Enter your region"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Role:</label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={farmerFormData.role}
                    readOnly
                    className="input-field border rounded-md py-2 px-3 w-full bg-gray-100 cursor-not-allowed"
                />
            </div>
        </div>

        <button type="submit" className="btn-submit bg-green-600 text-white hover:bg-green-700 transition duration-200 w-full py-2 rounded-md shadow-md">
            Register as Farmer
        </button>
    </form>
)}




                   {activeTab === 'buyer' && (
    <form className="space-y-6 p-6 border rounded-lg shadow-lg bg-white" onSubmit={handleBuyerRegistration}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={buyerFormData.name}
                    onChange={(e) => handleInputChange(e, setBuyerFormData)}
                    required
                    placeholder="Enter your name"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="mobile" className="block mb-1 font-medium text-gray-700">Mobile Number:</label>
                <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={buyerFormData.mobile}
                    onChange={(e) => handleInputChange(e, setBuyerFormData)}
                    required
                    placeholder="Mobile Number"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email Address:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={buyerFormData.email}
                    onChange={(e) => handleInputChange(e, setBuyerFormData)}
                    required
                    placeholder="Email Address"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="address" className="block mb-1 font-medium text-gray-700">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={buyerFormData.address}
                    onChange={(e) => handleInputChange(e, setBuyerFormData)}
                    required
                    placeholder="Address"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={buyerFormData.password}
                    onChange={(e) => handleInputChange(e, setBuyerFormData)}
                    required
                    placeholder="Enter a secure password"
                    className="input-field border rounded-md py-2 px-3 w-full focus:ring focus:ring-green-300"
                />
            </div>

            <div className="form-group">
                <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Role:</label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={buyerFormData.role}
                    onChange={handleInputChange}
                    disabled // Predefined as 'admin'
                    className="input-field border rounded-md py-2 px-3 w-full bg-gray-100 cursor-not-allowed"
                />
            </div>
        </div>

        <button type="submit" className="btn-submit bg-green-600 text-white hover:bg-green-700 transition duration-200 w-full py-2 rounded-md shadow-md">
            Register as Buyer
        </button>
    </form>
)}

                </div>
            </div>
        </>
    );
};

export default Registration;