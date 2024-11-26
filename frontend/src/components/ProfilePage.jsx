import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import MyCropList from './MyCropList';
import MyAuctionList from './MyAuctionList';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [farmerData, setFarmerData] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [proof, setProof] = useState(null);
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Function to handle file input change
    const handleProofChange = (event) => {
        setProof(event.target.files[0]);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!proof || !amount || !comment) {
            alert('All fields are required');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('proof', proof);
        formData.append('amount', amount);
        formData.append('comment', comment);

        try {
            const response = await axios.post('http://localhost:3000/api/commission/proof', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(response.data.message); // Success message
            setModalVisible(false); // Close modal
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting proof');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch the user ID from the token
    const fetchUserId = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        return tokenPayload.id; // Extract farmer_id (assuming it's stored as 'id' in token)
    };

    const farmerId = fetchUserId();

    // Fetch farmer data including profile image
    useEffect(() => {
        const fetchFarmerData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/farmer/getfarmer/${farmerId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFarmerData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch farmer data');
                setLoading(false);
            }
        };
        fetchFarmerData();
    }, [farmerId]);

    // Handle image upload
    const handleImageChange = async (e) => {
        const formData = new FormData();
        formData.append('profilePicture', e.target.files[0]);

        try {
            const response = await axios.put(
                `http://localhost:3000/api/farmer/updatefarmers/${farmerId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setFarmerData({ ...farmerData, profilePicture: response.data.data.profilePicture });
            toast.success('Profile image updated successfully');
        } catch (err) {
            toast.error('Failed to update profile image');
        }
    };

    // Handle update farmer details
    const handleUpdateFarmer = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/farmer/updatefarmers/${farmerId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setFarmerData(response.data.data);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster position="top-center" />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <div>
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden">
                            <img
                                src={farmerData.profilePicture || 'default-profile-image.png'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">{farmerData.fullName}</h2>
                            <p className="text-gray-600">{farmerData.email}</p>
                            <p className="text-gray-600">{farmerData.mobile}</p>
                            <p className="text-gray-600">{farmerData.farmAddress}</p>
                            <p className="text-gray-600">{farmerData.farmingType}</p>
                            <p>Your unpaid commission: {farmerData.unpaidCommission}</p>
                            {farmerData.unpaidCommission > 0 && (
                                <div>
                                    <button 
                                    className="mt-4 w-full bg-orange-800 text-white font-bold py-2 rounded hover:bg-orange-950 transition duration-300"
                                    onClick={() => setModalVisible(true)}>Pay Commission</button>
                                </div>

                            )}
                            <div className="mt-4">
                                <label htmlFor="profileImage" className="text-blue-600 cursor-pointer">
                                    Edit Profile Image
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal for submitting proof */}
                    {modalVisible && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
                            <div className="bg-white p-6 rounded shadow-lg w-96">
                                <h2 className="text-xl font-bold mb-4">Submit Commission Proof</h2>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Upload Proof (Image):</label>
                                        <input
                                            type="file"
                                            name="proof"
                                            onChange={handleProofChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Amount:</label>
                                        <input
                                            className="w-full p-2 border border-gray-300 rounded mb-4"
                                            type="number"
                                            name="amount"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Comment:</label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded mb-4"
                                            name="comment"
                                            value={comment}
                                            onChange={handleCommentChange}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </button>
                                        <button type="button"
                                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                                            onClick={() => setModalVisible(false)}>
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Profile Update Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">Update Your Profile</h3>
                        {/* Form for updating profile details */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const updatedData = {
                                    fullName: e.target.fullName.value,
                                    email: e.target.email.value,
                                    mobile: e.target.mobile.value,
                                    farmAddress: e.target.farmAddress.value,
                                    farmingType: e.target.farmingType.value,
                                    farmingExperience: e.target.farmingExperience.value,
                                    farmingPracticesDescription: e.target.farmingPracticesDescription.value,
                                };
                                handleUpdateFarmer(updatedData);
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    defaultValue={farmerData.fullName}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={farmerData.email}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Mobile</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    defaultValue={farmerData.mobile}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Farm Address</label>
                                <input
                                    type="text"
                                    name="farmAddress"
                                    defaultValue={farmerData.farmAddress}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Farming Type</label>
                                <input
                                    type="text"
                                    name="farmingType"
                                    defaultValue={farmerData.farmingType}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Farming Experience</label>
                                <input
                                    type="text"
                                    name="farmingExperience"
                                    defaultValue={farmerData.farmingExperience}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold">Farming Practices Description</label>
                                <textarea
                                    name="farmingPracticesDescription"
                                    defaultValue={farmerData.farmingPracticesDescription}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-green-700 disabled:opacity-50">Update Profile</button>
                        </form>
                    </div>

                    {/* Crop List Section */}
                    <div className="mt-6">
                        <MyCropList />
                    </div>

                    {/* Auction List Section */}
                    <div className="mt-6">
                        
                        <MyAuctionList />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
