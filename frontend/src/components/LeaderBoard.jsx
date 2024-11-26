import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Leaderboard = () => {
  const { auctionId } = useParams(); // Auction ID from route params
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctionDetails();
  }, []);

  const fetchAuctionDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Not Authorised');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/auction/auctionDetail/${auctionId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuctionDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching auction details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  if (!auctionDetails) {
    return <p className="text-center mt-10 text-red-500">No auction details found.</p>;
  }

  const { auctionItem, bidders } = auctionDetails;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Auction Leaderboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">{auctionItem.title}</h2>
        <p className="text-gray-600">{auctionItem.description}</p>
        <p className="text-gray-600 mt-2">
          Starting Bid: <span className="font-bold">₹{auctionItem.startingBid}</span>
        </p>
        <p className="text-gray-600">
          Ends At:{" "}
          <span className="font-bold">
            {new Date(auctionItem.endTime).toLocaleString()}
          </span>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Bidders</h2>

      {bidders.length === 0 ? (
        <p className="text-center text-gray-500">No bids placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-left">
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Bidder</th>
                <th className="py-3 px-4 font-bold">Bid Amount</th>
              </tr>
            </thead>
            <tbody>
              {bidders.map((bid, index) => (
                <tr
                  key={bid._id}
                  className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{bid.name || "Anonymous"}</td>
                  <td className="py-3 px-4 font-bold">₹{bid.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
