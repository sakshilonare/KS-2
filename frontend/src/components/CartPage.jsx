import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
// import {loadStripe} from '@stripe/stripe-js';

const CartPage = () => {
    const { cart, removeFromCart, placeOrder } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState({
        address: '',
        phoneNumber: '',
        paymentMethod: 'cod',
    });
    const navigate = useNavigate();

    const grandTotal = cart.reduce((total, item) => total + item.pricePerKg * item.quantity, 0);


    const handleProceedToPayment = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Save the order to orders list
        placeOrder(cart);
        console.log(placeOrder);
        
        // Redirect to the Orders page
        navigate('/buyer/orders');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // const makePayment = async ()=>{
    //     const stripePromise = loadStripe('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3');
    // }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
            {cart.length > 0 ? (
                <div className="space-y-4">
                    {cart.map((item) => {
                        const totalAmount = item.pricePerKg * item.quantity;

                        return (
                            <div key={item._id} className="bg-white p-5 shadow-md rounded-lg flex justify-between items-center">
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

                                <div className="w-2/6 pl-4">
                                    <h2 className="text-xl font-bold">{item.crop}</h2>
                                    <p className="text-gray-700">Quantity: {item.quantity} kg</p>
                                    <p className="text-gray-700">Price per kg: ₹{item.pricePerKg}</p>
                                </div>

                                <div className="w-1/6 text-right">
                                    <p className="text-xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Total</p>
                                </div>

                                <div className="w-1/6">
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center">Your cart is empty</p>
            )}

            {cart.length > 0 && (
                <div className="mt-6 flex justify-between items-center font-bold text-xl">
                    <p>Grand Total:</p>
                    <p className="text-green-600">₹{grandTotal.toFixed(2)}</p>
                </div>
            )}

            <div className="mt-8 flex justify-center">
            <button
                    className={`px-6 py-3 rounded-md ${
                        cart.length > 0
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handleProceedToPayment}
                    disabled={cart.length === 0}
                >
                    Proceed to Payment
                </button>
            </div>

            {/* Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-gray-700">Delivery Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={deliveryDetails.address}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={deliveryDetails.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Payment Method</label>
                                <div className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        id="cod"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={deliveryDetails.paymentMethod === 'cod'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="cod">Cash on Delivery</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="razorpay"
                                        name="paymentMethod"
                                        value="razorpay"
                                        checked={deliveryDetails.paymentMethod === 'razorpay'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="razorpay">Online Payment (Razorpay)</label>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-6 py-2 rounded-md"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
