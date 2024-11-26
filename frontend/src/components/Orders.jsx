import React from 'react';
import { useCart } from './CartContext';

const Orders = () => {
    const { orders } = useCart();

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order, orderIndex) => (
                        <div key={orderIndex} className="bg-white p-5 shadow-md rounded-lg">
                            <h2 className="text-xl font-bold">Order #{orderIndex + 1}</h2>
                            <div className="space-y-4 mt-4">
                                {order.map((item) => {
                                    const totalAmount = item.pricePerKg * item.quantity;

                                    return (
                                        <div
                                            key={item._id}
                                            className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
                                        >
                                            {/* Crop Image */}
                                            <div className="w-1/6">
                                                {item.cropimage1 ? (
                                                    <img
                                                        src={item.cropimage1}
                                                        alt={item.crop}
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
                                                <h3 className="text-lg font-bold">{item.crop}</h3>
                                                <p className="text-gray-700">Quantity: {item.quantity} kg</p>
                                                <p className="text-gray-700">Price per kg: ₹{item.pricePerKg}</p>
                                            </div>

                                            {/* Total Amount */}
                                            <div className="w-1/6 text-right">
                                                <p className="text-lg font-bold text-green-600">
                                                    ₹{totalAmount.toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-600">Total</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No orders yet</p>
            )}
        </div>
    );
};

export default Orders;
