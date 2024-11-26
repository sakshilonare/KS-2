import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext'; // Adjust the path accordingly
import { Link, useParams, useNavigate } from 'react-router-dom';

const CropDetails = () => {
    const { cropId } = useParams();
    const { addToCart } = useCart(); // Use the cart context
    const [crop, setCrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuantity, setSelectedQuantity] = useState(1); // New state for quantity
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role;

    useEffect(() => {
        const fetchCropDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/crop/cropdetails/${cropId}`);
                setCrop(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching crop details:', error);
                setLoading(false);
            }
        };

        fetchCropDetails();
    }, [cropId]);

    const handleAddToCart = () => {
        if (selectedQuantity > 0) {
            addToCart(crop, selectedQuantity); // Pass both crop and quantity separately
            alert(`${crop.crop} (Quantity: ${selectedQuantity}) has been added to your cart!`);
            navigate('/buyer/all-crops');
        } else {
            alert('Please select a valid quantity.');
        }
    };

    const handleEnterAuction = () => {
        navigate(`/bidders/${cropId}`);
      };


    // Increase quantity
    const increaseQuantity = () => {
        if (selectedQuantity < crop.quantity) { // Ensure quantity doesn't exceed available stock
            setSelectedQuantity((prevQty) => prevQty + 1);
        }
    };

    // Decrease quantity
    const decreaseQuantity = () => {
        if (selectedQuantity > 1) {
            setSelectedQuantity((prevQty) => prevQty - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
            </div>
        );
    }

    if (!crop) {
        return <p className="text-center text-red-500">Error: Crop details not found.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-4">{crop.crop}</h1>
            <div className="flex bg-white shadow-md rounded-lg overflow-hidden">
                <div className="w-1/2 p-4">
                    {crop.cropimage1 ? (
                        <img
                            src={crop.cropimage1} // Directly using the Cloudinary URL
                            alt={crop.crop}
                            className="w-full h-64 object-cover"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
                <div className="w-1/2 p-6">
                    <p className="text-lg mb-2"><strong>Crop Name:</strong> {crop.crop}</p>
                    <p className="text-lg mb-2"><strong>Crop Type:</strong> {crop.croptype}</p>
                    <p className="text-lg mb-2"><strong>Harvest Date:</strong> {new Date(crop.harvestdate).toLocaleDateString()}</p>
                    <p className="text-lg mb-2"><strong>Price per kg:</strong> ₹{crop.pricePerKg}</p>
                    <p className="text-lg mb-2"><strong>Quantity (in kg):</strong> {crop.quantity}</p>
                    <p className="text-lg mb-2"><strong>Region:</strong> {crop.region}</p>
                    <p className="text-lg mb-2"><strong>State:</strong> {crop.state}</p>
                    <p className="text-lg mb-2"><strong>Season:</strong> {crop.season}</p>
                    <p className="text-lg mb-2"><strong>Soil Type:</strong> {crop.soiltype}</p>
                    <p className="text-lg mb-4"><strong>Description:</strong> {crop.description || 'No description available'}</p>

                    

                    {/* {role === 'buyer' && (
                        <div className="mt-4">
                            <button
                                onClick={handleAddToCart}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Enter Auction
                            </button>
                        </div>
                    )} */}




                    {/* Quantity Counter */}
                    {role === 'buyer' && (
                        <div className="flex items-center mb-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md"
                                onClick={decreaseQuantity}
                            >
                                -
                            </button>
                            <span className="mx-4 text-lg">{selectedQuantity}</span>
                            <button
                                className="bg-gray-300 text-gray-700 px-2 py-1 rounded-md"
                                onClick={increaseQuantity}
                            >
                                +
                            </button>
                        </div>
                    )}


                    {role === 'buyer' && (
                        <button
                            onClick={handleAddToCart}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropDetails;
