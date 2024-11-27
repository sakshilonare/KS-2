import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MyCropList = () => {
    const [myCrops, setMyCrops] = useState([]);
    const [editingCrop, setEditingCrop] = useState(null);
    const [editData, setEditData] = useState({ cropName: '', cropType: '', pricePerKg: '', quantity: '' });
    const [loading, setLoading] = useState(true);

    // Fetch crops added by the logged-in farmer
    useEffect(() => {
        const fetchMyCrops = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('User is not authenticated!');
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/crop/mycrops', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setMyCrops(response.data);
            } catch (error) {
                toast.error('Failed to load your crops');
            } finally {
                setLoading(false);
            }
        };

        fetchMyCrops();
    }, []);

    // Handle Delete Crop
    const deleteCrop = async (cropId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('User is not authenticated!');
                return;
            }

            await axios.delete(`http://localhost:3000/api/crop/deletecrop/${cropId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMyCrops(myCrops.filter((crop) => crop._id !== cropId));
            toast.success('Crop deleted successfully');
        } catch (error) {
            toast.error('Failed to delete the crop');
        }
    };

    // Handle Edit Crop form submission
    const handleEditSubmit = async (cropId) => {
        if (!editData.cropName || !editData.cropType || !editData.pricePerKg || !editData.quantity) {
            toast.error('Please fill out all fields before submitting');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('User is not authenticated!');
                return;
            }

            await axios.put(`http://localhost:3000/api/crop/edit/${cropId}`, editData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const updatedCrops = myCrops.map((crop) =>
                crop._id === cropId ? { ...crop, ...editData } : crop
            );
            setMyCrops(updatedCrops);
            setEditingCrop(null);
            toast.success('Crop updated successfully');
        } catch (error) {
            toast.error('Failed to update the crop');
        }
    };

    // Handle Edit Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">My Crops List</h1>

            {loading ? (
                <p>Loading crops...</p>
            ) : myCrops.length > 0 ? (
                <div className="space-y-4">
                    {myCrops.map((crop) => (
                        <div key={crop._id} className="bg-white p-5 shadow-md rounded-lg flex justify-between items-center transition-transform transform hover:scale-105">
                            {/* Crop Image */}
                            <div className="w-1/6">
                                {crop.cropimage1 ? (
                                    <img
                                        src={crop.cropimage1}
                                        alt={crop.cropName}
                                        className="w-full h-24 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Crop Details */}
                            <div className="w-2/6 pl-4">
                                <h2 className="text-xl font-bold">{crop.crop}</h2>
                                <p className="text-gray-700">Type: {crop.croptype}</p>
                                <p className="text-gray-700">Price per kg: ₹{crop.pricePerKg}</p>
                                <p className="text-gray-700">Quantity: {crop.quantity} kg</p>
                            </div>

                            {/* Edit/Delete Buttons */}
                            <div className="w-1/6 flex justify-between items-center">
                                {editingCrop === crop._id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="cropName"
                                            value={editData.cropName}
                                            onChange={handleInputChange}
                                            placeholder="Crop Name"
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded"
                                        />
                                        <input
                                            type="text"
                                            name="cropType"
                                            value={editData.cropType}
                                            onChange={handleInputChange}
                                            placeholder="Crop Type"
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded"
                                        />
                                        <input
                                            type="number"
                                            name="pricePerKg"
                                            value={editData.pricePerKg}
                                            onChange={handleInputChange}
                                            placeholder="Price per kg"
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded"
                                        />
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={editData.quantity}
                                            onChange={handleInputChange}
                                            placeholder="Quantity (kg)"
                                            className="block w-full p-2 mb-2 border border-gray-300 rounded"
                                        />
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => handleEditSubmit(crop._id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingCrop(null)}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingCrop(crop._id);
                                                setEditData({
                                                    cropName: crop.cropName,
                                                    cropType: crop.cropType,
                                                    pricePerKg: crop.pricePerKg,
                                                    quantity: crop.quantity,
                                                });
                                            }}
                                            className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCrop(crop._id)}
                                            className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center">You haven't added any crops yet.</p>
            )}
        </div>
    );
};

export default MyCropList;
