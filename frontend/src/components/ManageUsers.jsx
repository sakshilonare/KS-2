import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [isBlocked, setIsBlocked] = useState({});
  const [showFarmers, setShowFarmers] = useState(true); // Toggle between farmers and buyers
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [itemsPerPage] = useState(6); // Number of items per page
  const [searchQuery, setSearchQuery] = useState(""); // Search query for both farmers and buyers

  // Fetch farmers' data
  const fetchFarmers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/farmers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const farmersWithType = response.data.data.map((farmer) => ({
        ...farmer,
        type: "farmer",
      }));
      setFarmers(farmersWithType);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      toast.error("Error fetching farmers");
    }
  };

  // Fetch buyers' data
  const fetchBuyers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/admin/buyers-all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const buyersWithType = response.data.data.map((buyer) => ({
        ...buyer,
        type: "buyer",
      }));
      setBuyers(buyersWithType);
    } catch (error) {
      console.error("Error fetching buyers:", error);
      toast.error("Error fetching buyers");
    }
  };

  // Block user
  const handleBlockUser = async (id, userType) => {
    if (!userType) {
      toast.error("User type is missing");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/api/admin/blockuser/${id}/${userType}`,
        { userId: id, userType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsBlocked((prev) => ({ ...prev, [id]: true }));
      toast.success(`${userType} blocked successfully`);
    } catch (error) {
      toast.error(`Error blocking ${userType}`);
    }
  };

  // Unblock user
  const handleUnblockUser = async (id, userType) => {
    if (!userType) {
      toast.error("User type is missing");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/api/admin/unblockuser/${id}/${userType}`,
        { userId: id, userType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsBlocked((prev) => ({ ...prev, [id]: false }));
      toast.success(`${userType} unblocked successfully`);
    } catch (error) {
      toast.error(`Error unblocking ${userType}`);
    }
  };

  // Toggle between farmers and buyers
  const handleToggle = () => {
    setShowFarmers(!showFarmers);
    setSearchQuery(""); // Reset search when toggling
    setCurrentPage(1); // Reset to page 1 when toggling
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Get paginated data for farmers or buyers
  const getPaginatedData = (data) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchFarmers();
    fetchBuyers();
  }, []);

  // Filter the data based on the search query
  const filterData = (data) => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get the current data (either farmers or buyers) to display
  const dataToDisplay = showFarmers ? farmers : buyers;
  const filteredData = filterData(dataToDisplay);
  const paginatedData = getPaginatedData(filteredData);

  // Total pages for pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Users List</h1>

      {/* Toggle Button */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {showFarmers ? "Show Buyers" : "Show Farmers"}
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={handleSearch}
          className="text-black p-2 border rounded-md w-1/3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.length > 0 ? (
          paginatedData.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition duration-300"
            >
              <div className="text-center">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                />
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600 mb-4">{user.mobile}</p>
              </div>
              <button
                onClick={() =>
                  isBlocked[user._id]
                    ? handleUnblockUser(user._id, user.type)
                    : handleBlockUser(user._id, user.type)
                }
                className={`mt-4 px-6 py-2 rounded-lg ${
                  isBlocked[user._id] ? "bg-green-500" : "bg-red-500"
                } text-white font-semibold hover:bg-opacity-80 transition duration-300`}
              >
                {isBlocked[user._id] ? "Unblock" : "Block"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-gray-500 col-span-full">
            No users found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              } hover:bg-blue-600 transition duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;