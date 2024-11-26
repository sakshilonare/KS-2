import React from 'react';

const CropCard = ({ crop }) => {
    return (
        <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white m-4">
            <img className="w-full h-48 object-cover" src={crop.cropimage1} alt={crop.crop} />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{crop.crop}</h3>
                <p className="text-gray-600">
                    <strong>Type:</strong> {crop.croptype}
                </p>
                <p className="text-gray-600">
                    <strong>Price per Kg:</strong> ₹{crop.pricePerKg}
                </p>
                <button className="mt-4 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition duration-300">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default CropCard;
