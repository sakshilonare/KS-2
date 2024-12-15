import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ManageCrops = () => {
    const [crops, setCrops] = useState([]);
    const [filteredCrops, setFilteredCrops] = useState([]);
    const [editCrop, setEditCrop] = useState(null);
    const [newCropData, setNewCropData] = useState({});
    const [generalSearchQuery, setGeneralSearchQuery] = useState("");
    const [cropIdSearchQuery, setCropIdSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/crops');
                setCrops(response.data);
                setFilteredCrops(response.data);
            } catch (error) {
                toast.error('Error fetching crops');
            }
        };
        fetchCrops();
    }, []);

    const handleSearch = () => {
        const result = crops.filter((crop) => {
            const matchesGeneralQuery = generalSearchQuery
                ? crop.crop.toLowerCase().includes(generalSearchQuery.toLowerCase())
                : true;

            const matchesCropId = cropIdSearchQuery
                ? crop._id.toLowerCase().includes(cropIdSearchQuery.toLowerCase())
                : true;

            const matchesFilterType = filterType
                ? crop.croptype.toLowerCase() === filterType.toLowerCase()
                : true;

            return matchesGeneralQuery && matchesCropId && matchesFilterType;
        });
        setFilteredCrops(result);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCropData({ ...newCropData, cropimage1: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteCrop = async (cropId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this crop?');
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:3000/api/admin/delete-crop/${cropId}`);
            toast.success('Crop deleted successfully');
            setFilteredCrops(filteredCrops.filter((crop) => crop._id !== cropId));
            setCrops(crops.filter((crop) => crop._id !== cropId));
        } catch (error) {
            toast.error('Error deleting crop');
        }
    };

    const handleEditCrop = (crop) => {
        setEditCrop(crop);
        setNewCropData({ ...crop });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(
                `http://localhost:3000/api/admin/update-crop/${editCrop._id}`,
                newCropData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success('Crop updated successfully');

            // Update the local crops state with the edited crop
            const updatedCrops = crops.map((crop) =>
                crop._id === editCrop._id ? { ...crop, ...newCropData } : crop
            );
            setCrops(updatedCrops);
            setFilteredCrops(updatedCrops);
            setEditCrop(null);
        } catch (error) {
            toast.error('Error updating crop');
        }
    };

    const paginatedCrops = filteredCrops.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);

    return (
        <div className="p-4">
            {/* Search and Filter Section */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search crops..."
                    value={generalSearchQuery}
                    onChange={(e) => setGeneralSearchQuery(e.target.value)}
                    className="mb-2 text-black p-2 border rounded w-1/3"
                />
                <select
                    name="type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="mb-2 text-black p-2 border rounded ml-4 w-1/4"
                >
                    <option value="">All Types</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                    <option value="pulses">Pulses</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by crop ID..."
                    value={cropIdSearchQuery}
                    onChange={(e) => setCropIdSearchQuery(e.target.value)}
                    className="ml-3 mb-2 text-black p-2 border rounded w-1/4"
                />
                <button
                    onClick={handleSearch}
                    className="ml-3 mb-2 bg-blue-500 text-white p-2 rounded"
                >
                    Search
                </button>
            </div>

            {/* Crops List */}
            <div>
                {paginatedCrops.map((crop) => (
                    <div
                        key={crop._id}
                        className="border p-4 mb-4 rounded shadow-md flex justify-between items-start"
                    >
                        <div className="w-2/3">
                            <h3 className="text-lg font-bold">{crop.crop}</h3>
                            <p>Id: {crop._id}</p>
                            <p>Type: {crop.croptype}</p>
                            <p>Price: Rs {crop.pricePerKg}</p>
                            <p>Region: {crop.region}</p>
                            <p>Harvest Date: {crop.harvestdate}</p>
                            <p>Season: {crop.season}</p>
                            <p>State: {crop.state}</p>
                            <p>Quantity: {crop.quantity} kg</p>
                            <p>Soil Type: {crop.soiltype}</p>
                            <p>Description: {crop.description}</p>
                            <div className="mt-2">
                                <button
                                    onClick={() => handleEditCrop(crop)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCrop(crop._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {crop.cropimage1 && (
                            <img
                                src={crop.cropimage1}
                                alt="Crop"
                                className="w-2/8 h-48 object-cover rounded ml-4"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Crop Modal */}
            {editCrop && (
                <div className="fixed inset-0 text-black bg-gray-700 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Crop</h2>
                        {Object.keys(newCropData).map((key) => (
                            <div key={key} className="mb-4">
                                <label className="block text-sm font-medium capitalize mb-1">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </label>
                                {key === 'cropimage1' ? (
                                    <>
                                        {newCropData.cropimage1 && (
                                            <img
                                                src={newCropData.cropimage1}
                                                alt="Current Crop"
                                                className="mb-2 w-full h-40 object-cover rounded"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="p-2 border rounded w-full"
                                        />
                                    </>
                                ) : (
                                    <input
                                        type="text"
                                        value={newCropData[key] || ''}
                                        onChange={(e) =>
                                            setNewCropData({ ...newCropData, [key]: e.target.value })
                                        }
                                        className="p-2 border rounded w-full"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={handleSaveEdit}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditCrop(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`mx-1 px-3 py-1 rounded ${
                            currentPage === index + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-black'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ManageCrops;