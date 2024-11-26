import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import closedImage from '../imgs/closed.png';
import notstartedImage from '../imgs/not-started.png';
import { Toaster, toast } from "react-hot-toast";



const AuctionCard = ({ auction, userRole }) => {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(null); // To hold the remaining time
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false); // For submission state

    const handleInputChange = (e) => {
        const { value } = e.target;
        setAmount(value);
    };

    const handleBid = async (e) => {
        e.preventDefault();
        if (amount <= 0 || isNaN(amount)) {
            toast.error("Please enter a valid bid amount.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You need to be logged in to place a bid.");
            return;
        }

        const formData = new FormData();
        formData.append("amount", amount);

        try {
            setLoading(true);

            // API call to place a bid
            const response = await axios.post(
                `http://localhost:3000/api/bids/place/${auction._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Bid placed successfully!");
                navigate(`/auction/leaderboard/${auction._id}`);
                // Fetch updated auction details
                const auctionDetails = await axios.get(
                    `http://localhost:3000/api/auction/auctionDetail/${auction._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Updated Auction Details: ", auctionDetails.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place the bid.");
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };


    // Calculate the remaining time
    const calculateRemainingTime = () => {
        const currentTime = new Date();
        const endTime = new Date(auction.endTime);
        const startTime = new Date(auction.startTime);

        // Ensure time values are valid
        if (isNaN(startTime) || isNaN(endTime)) {
            console.error("Invalid auction time values!");
            return null;
        }

        if (currentTime >= startTime && currentTime < endTime) {
            const timeDiff = endTime.getTime() - currentTime.getTime(); // Time difference in milliseconds

            const hours = Math.floor(timeDiff / (1000 * 60 * 60)); // Total hours
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000); // Remaining seconds

            return { hours, minutes, seconds };
        } else if (currentTime >= endTime) {
            return null;
        }

        // Auction has not started yet
        return { hours: 0, minutes: 0, seconds: 0 };
    };


    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime === null) {
                clearInterval(interval);
                return;
            }

            setRemainingTime(calculateRemainingTime());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [auction.startTime, auction.endTime, remainingTime]);

    useEffect(() => {
        // Set initial remaining time
        setRemainingTime(calculateRemainingTime());
    }, [auction.startTime, auction.endTime]);

    const isClosed = new Date(auction.endTime) < new Date();
    const notStarted = new Date(auction.startTime) > new Date();

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

    return (
        <>
        <Toaster position="top-center" />
        <div
            className={`max-w-sm rounded-lg overflow-hidden shadow-lg bg-white m-4 relative ${(isClosed || notStarted) ? 'bg-gray-300' : ''
                }`}
        >
            {/* Image */}
            <img
                className={`w-full h-48 object-cover ${(isClosed || notStarted) ? 'opacity-50' : ''}`}
                src={auction.image.url}
                alt={auction.title}
            />

            {/* Closed Overlay */}
            {isClosed && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30">
                    <img
                        src={closedImage}
                        alt="Closed"
                        className="h-100% w-100%"
                    />
                </div>
            )}

            {/* Closed Overlay */}
            {notStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30">
                    <img
                        src={notstartedImage}
                        alt="Not-Started"
                        className="h-100% w-100%"
                    />
                </div>
            )}

            {/* Content */}
            <div className={`p-4 ${(isClosed || notStarted) ? 'opacity-50' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-800">{auction.title}</h3>
                <p className="text-gray-600">
                    <strong>Description:</strong> {auction.description}
                </p>
                <p className="text-gray-600">
                    <strong>Category:</strong> {auction.category}
                </p>
                <p className="text-gray-600">
                    <strong>Starting Bid:</strong> ₹{auction.startingBid}
                </p>
                <p className="text-gray-600">
                    <strong>Start Time:</strong>{' '}
                    {new Date(auction.startTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                    <strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                    <strong>Created By:</strong> {auction.createdBy.name}
                </p>

                {/* Countdown Timer */}
                {remainingTime ? (
                    <div className="text-red-600 font-bold text-lg mt-4">
                        {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
                    </div>
                ) : (
                    <div className="text-green-600 font-bold text-lg mt-4">Auction Ended</div>
                )}

                {/* Place Bid Button - Visible for buyers and disabled if closed
                {userRole === 'buyer' && (
                    <button
                        className={`mt-4 w-full text-white font-bold py-2 rounded transition duration-300 ${isClosed
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'mt-4 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition duration-300'
                            }`}
                        disabled={(isClosed || notStarted)}
                    >
                        Place Bid
                    </button>
                )}
                <button
                    onClick={() => navigate(`/auction/leaderboard/${auction._id}`)}
                    className="mt-4 w-full bg-orange-800 text-white font-bold py-2 rounded hover:bg-orange-950 transition duration-300"
                >
                    View Leaderboard
                </button> */}

                {userRole === 'buyer' && (
                    <button
                        className={`mt-4 w-full text-white font-bold py-2 rounded transition duration-300 ${auction.isClosed || auction.notStarted
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                        disabled={auction.isClosed || auction.notStarted}
                        onClick={() => setShowModal(true)}
                    >
                        Place Bid
                    </button>

                )}
                <button
                    onClick={() => navigate(`/auction/leaderboard/${auction._id}`)}
                    className="mt-4 w-full bg-orange-800 text-white font-bold py-2 rounded hover:bg-orange-950 transition duration-300"
                >
                    View Leaderboard
                </button>

                {/* Modal for placing bid */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
                            <form onSubmit={handleBid}>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Enter Bid Amount (₹):
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                    value={amount}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default AuctionCard;
