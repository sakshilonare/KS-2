import React, { useState, useEffect } from 'react';
import FarmerNav from './FarmerNav';
import { useNavigate } from 'react-router-dom';
import BuyerNav from './BuyerNav';
import axios from 'axios';

const Allcrops = () => {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/crop/cropdata');
                setCrops(response.data);
            } catch (error) {
                console.error('Error fetching crops:', error);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (cropId) => {
        // Retrieve the user role from local storage
        const user = JSON.parse(localStorage.getItem('user'));
        const role = user?.role;

        // Determine the navigation path based on the role
        let path;
        if (role === 'farmer') {
            path = `/farmer/cropdetails/${cropId}`;
        } else if (role === 'buyer') {
            path = `/buyer/cropdetails/${cropId}`;
        } else if (role === 'admin') {
            path = `/admin/cropdetails/${cropId}`;
        } else {
            console.error('Unknown role');
            return;
        }
        navigate(path);
    };
// const handleSelectCrop = (cropId) => {
//         // Redirect to the CropDetails page
//         navigate(`/farmer/cropdetails/${cropId}`);  // Redirects to the crop details route
//     };

    return (
        <div className="min-h-screen bg-gray-100 ">
            {/* <BuyerNav /> */}
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-6">All Crops</h1>
                {crops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {crops.map(crop => (
                            <div key={crop._id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    {crop.cropimage1 ? (
                                        <img
                                            src={crop.cropimage1} // Directly using the Cloudinary URL
                                            alt={crop.crop}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-2">{crop.crop}</h3>
                                    <p className="text-gray-600">Type: {crop.croptype}</p>
                                    <p className="text-gray-600">Price per kg: ₹{crop.pricePerKg}</p>
                                    {/* <p className="text-gray-600">Weight: {crop.weight} kg</p> */}
                                    <p className="text-gray-600">Region: {crop.region}</p>
                                    <p className="text-gray-600">State: {crop.state}</p>

                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                           onClick={() => handleViewDetails(crop._id)}  // Use the handleViewDetails function
                                        
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No crops available</p>
                )}
            </div>
        </div>
    );
};

export default Allcrops;
