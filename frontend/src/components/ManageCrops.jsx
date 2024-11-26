import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
 import { useParams } from 'react-router-dom';

const ManageCrops = () => {
    const [crops, setCrops] = useState([]);
    const { cropId } = useParams();
    const [selectedCrops, setSelectedCrops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({ type: '', region: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [activityLog, setActivityLog] = useState([]);
    const [editCrop, setEditCrop] = useState(null); // For edit crop modal
    const [newCropData, setNewCropData] = useState({
        crop: '',
        type: '',
        price: '',
        region: ''
    });

    // Fetch crops data from the backend
    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/crops');
                setCrops(response.data);
            } catch (error) {
                toast.error('Error fetching crops');
            }
        };
        fetchCrops();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSelectCrop = (cropId) => {
        setSelectedCrops((prev) =>
            prev.includes(cropId) ? prev.filter((id) => id !== cropId) : [...prev, cropId]
        );
    };

    const handleBulkDelete = async () => {
        try {
            await axios.delete('/api/crops/bulk-delete', { data: { ids: selectedCrops } });
            toast.success('Crops deleted successfully');
            setCrops(crops.filter((crop) => !selectedCrops.includes(crop._id)));
        } catch (error) {
            toast.error('Error deleting crops');
        }
    };

    const handleBulkUpdate = async () => {
        // Example: updating price for selected crops
        const updatedPrice = 100; // Example value
        try {
            await axios.put('/api/crops/bulk-update', { ids: selectedCrops, updateData: { price: updatedPrice } });
            toast.success('Crops updated successfully');
            // Update crops in the state (if needed)
        } catch (error) {
            toast.error('Error updating crops');
        }
    };

    const handleToggleAvailability = async (cropId) => {
        try {
            const updatedCrop = await axios.patch(`/api/crops/${cropId}/toggle-availability`);
            toast.success('Crop availability updated');
            setCrops((prevCrops) =>
                prevCrops.map((crop) =>
                    crop._id === cropId ? { ...crop, available: updatedCrop.data.available } : crop
                )
            );
        } catch (error) {
            toast.error('Error updating availability');
        }
    };

    const handleDeleteCrop = async (cropId) => {
        try {
            await axios.delete(`http://localhost:3000/api/admin/delete-crop/${crop_id}`);
            toast.success('Crop deleted successfully');
            setCrops(crops.filter((crop) => crop._id !== cropId));
        } catch (error) {
            toast.error('Error deleting crop');
        }
    };

    const handleEditCrop = (crop) => {
        setEditCrop(crop);
        setNewCropData({
            name: crop.name,
            type: crop.type,
            price: crop.price,
            region: crop.region
        });
    };

    const handleSaveEdit = async () => {
        try {
            const updatedCrop = await axios.put(`/api/crops/${editCrop._id}`, newCropData);
            toast.success('Crop updated successfully');
            setCrops((prevCrops) =>
                prevCrops.map((crop) => (crop._id === editCrop._id ? updatedCrop.data : crop))
            );
            setEditCrop(null);
            setNewCropData({
                name: '',
                type: '',
                price: '',
                region: ''
            });
        } catch (error) {
            toast.error('Error updating crop');
        }
    };

    const fetchActivityLog = async (cropId) => {
        try {
            const response = await axios.get(`/api/crops/${cropId}/activity`);
            setActivityLog(response.data);
        } catch (error) {
            toast.error('Error fetching activity log');
        }
    };

   const filteredCrops = crops.filter(crop => {
    return crop.crop?.toLowerCase().includes(searchQuery.toLowerCase());
});


    const paginatedCrops = filteredCrops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search crops..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-2 p-2 border rounded"
                />
                <select
                    name="type"
                    onChange={handleFilterChange}
                    className="mb-2 p-2 border rounded ml-4"
                >
                    <option value="">All Types</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                </select>
                <select
                    name="region"
                    onChange={handleFilterChange}
                    className="mb-2 p-2 border rounded ml-4"
                >
                    <option value="">All Regions</option>
                    <option value="north">North</option>
                    <option value="south">South</option>
                </select>
            </div>

            <div className="flex justify-between mb-4">
                <button
                    onClick={handleBulkDelete}
                    className="bg-red-500 text-white p-2 rounded"
                >
                    Delete Selected
                </button>
                <button
                    onClick={handleBulkUpdate}
                    className="bg-yellow-500 text-white p-2 rounded"
                >
                    Bulk Update
                </button>
            </div>

            <div>
                {paginatedCrops.map((crop) => (
                    // <div className="w-1/2 p-4">
                    // {crop.cropimage1 ? (
                    //     <img
                    //         src={crop.cropimage1} // Directly using the Cloudinary URL
                    //         alt={crop.crop}
                    //         className="w-full h-64 object-cover"
                    //     />
                    // ) : (
                    //     <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    //         No Image
                    //     </div>
                    // )}

                    // {/* </div> */}

                    <div key={crop._id} className="border p-4 mb-4 rounded shadow-md">
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                onChange={() => handleSelectCrop(crop._id)}
                                checked={selectedCrops.includes(crop._id)}
                                className="mr-2"
                            />
                            <span>{crop.crop}</span>
                        </div>
                        <p>Type: {crop.croptype}</p>
                        <p>Price per Kg: Rs {crop.pricePerKg}</p>
                        <p>Region: {crop.region}</p>
                        <button
                            onClick={() => handleToggleAvailability(crop._id)}
                            className={`p-2 mt-2 rounded ${crop.available ? 'bg-green-500' : 'bg-gray-500'}`}
                        >
                            {crop.available ? 'Mark as Unavailable' : 'Mark as Available'}
                        </button>
                        <button
                            onClick={() => fetchActivityLog(crop._id)}
                            className="bg-blue-500 text-white p-2 rounded ml-2"
                        >
                            View Activity Log
                        </button>
                        <button
                            onClick={() => handleEditCrop(crop)}
                            className="bg-yellow-500 text-white p-2 rounded ml-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteCrop(crop._id)}
                            className="bg-red-500 text-white p-2 rounded ml-2"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {activityLog.length > 0 && (
                <div className="mt-4">
                    <h3>Activity Log</h3>
                    <ul>
                        {activityLog.map((log) => (
                            <li key={log._id}>{log.action} on {log.date}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Edit Crop Modal */}
            {editCrop && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2>Edit Crop</h2>
                        <input
                            type="text"
                            placeholder="Crop Name"
                            value={newCropData.name}
                            onChange={(e) => setNewCropData({ ...newCropData, name: e.target.value })}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Crop Type"
                            value={newCropData.type}
                            onChange={(e) => setNewCropData({ ...newCropData, type: e.target.value })}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newCropData.price}
                            onChange={(e) => setNewCropData({ ...newCropData, price: e.target.value })}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Region"
                            value={newCropData.region}
                            onChange={(e) => setNewCropData({ ...newCropData, region: e.target.value })}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <div className="mt-4">
                            <button onClick={handleSaveEdit} className="bg-green-500 text-white p-2 rounded">
                                Save
                            </button>
                            <button
                                onClick={() => setEditCrop(null)}
                                className="bg-gray-500 text-white p-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCrops;
