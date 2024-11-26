import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuctionCard from './AuctionCard';

const AuctionPage = () => {
  const [allAuctions, setAllAuctions] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // Fetch all auctions
  const fetchAuctions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auction/allitems');
      setAllAuctions(response.data.items);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  // Fetch user role from localStorage and set it
  const fetchUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.role : null;  // Ensure you check if user exists before accessing 'role'
  };

  useEffect(() => {
    fetchAuctions();
    const role = fetchUserRole();  // Fetch role
    setUserRole(role);  // Update state with role
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Auctions</h1>
      <div className="flex flex-wrap justify-center">
        {allAuctions.length > 0 ? (
          allAuctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} userRole={userRole} />
          ))
        ) : (
          <p>No auctions available at the moment.</p>
        )}
      </div>
    </div>
  );
};


export default AuctionPage;
