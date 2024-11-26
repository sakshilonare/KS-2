import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";

const MyAuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [auctionIdToRepublish, setAuctionIdToRepublish] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const navigate = useNavigate();

    // Fetch farmer's auctions
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/auction/myitems', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAuctions(response.data.items);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch auctions');
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const formatToReadableDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toString(); 
    };

    // Republish the auction with new start and end time
    const handleRepublish = async () => {
        if (!startTime || !endTime) {
            toast.error('Both start time and end time are required.');
            return;
        }

        const formData = new FormData();
        formData.append('startTime', formatToReadableDate(startTime));
        formData.append('endTime', formatToReadableDate(endTime));

        try {
            const response = await axios.put(
                `http://localhost:3000/api/auction/item/republish/${auctionIdToRepublish}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data', 
                    },
                }
            );

            setAuctions((prevAuctions) =>
                prevAuctions.map((auction) =>
                    auction._id === auctionIdToRepublish ? { ...auction, ...response.data.auctionItem } : auction
                )
            );
            toast.success(response.data.message);
            setShowModal(false);  // Close the modal after republish
        } catch (err) {
            toast.error('Failed to republish auction');
            setError('Failed to republish auction');
        }
    };

    // Check if republish button should be disabled
    const isRepublishDisabled = (endTime) => {
        return new Date(endTime) > Date.now();
    };

    return (
        <>
            <Toaster position="top-center" />
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Your Auctions</h2>

                {loading ? (
                    <div>Loading auctions...</div>
                ) : error ? (
                    <div className="text-red-600">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {auctions.length === 0 ? (
                            <div>No auctions found</div>
                        ) : (
                            auctions.map((auction) => (
                                <div key={auction._id} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white m-4">
                                    <img className="w-full h-48 object-cover" src={auction.image.url} alt={auction.title} />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{auction.title}</h3>
                                        <p className="text-gray-600">{auction.description}</p>
                                        <p className="text-gray-600"><strong>Starting Bid:</strong> ₹{auction.startingBid}</p>
                                        <p className="text-gray-600"><strong>Start Time:</strong> {new Date(auction.startTime).toLocaleString()}</p>
                                        <p className="text-gray-600"><strong>End Time:</strong> {new Date(auction.endTime).toLocaleString()}</p>
                                        <div className="mt-4 flex space-x-4">
                                            <button
                                                onClick={() => {
                                                    setAuctionIdToRepublish(auction._id);
                                                    setShowModal(true);
                                                }}
                                                disabled={isRepublishDisabled(auction.endTime)}
                                                className={`${isRepublishDisabled(auction.endTime) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                                                    } text-white py-2 px-4 rounded`}
                                            >
                                                Republish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Republish Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Republish Auction</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleRepublish(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">End Time</label>
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Republish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyAuctionList;
