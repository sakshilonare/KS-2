import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";

const AuctionForm = () => {
  const [auctionData, setAuctionData] = useState({
    title: '',
    description: '',
    category: 'Fruit',
    startingBid: '',
    startTime: '',
    endTime: '',
    image: null,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuctionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setAuctionData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Convert datetime-local value to the required format
  const formatToReadableDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toString(); // Converts to "Mon Nov 25 2024 15:01:00 GMT+0530 (India Standard Time)"
  };

  // Create a new auction
  const handleCreateAuction = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You need to be logged in to create an auction.');
      return;
    }

    const formData = new FormData();
    formData.append('title', auctionData.title);
    formData.append('description', auctionData.description);
    formData.append('category', auctionData.category);
    formData.append('startingBid', auctionData.startingBid);
    formData.append('startTime', formatToReadableDate(auctionData.startTime)); // Format startTime
    formData.append('endTime', formatToReadableDate(auctionData.endTime)); // Format endTime
    if (auctionData.image) {
      formData.append('image', auctionData.image);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auction/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setAuctionData({
          title: '',
          description: '',
          category: 'Fruit',
          startingBid: '',
          startTime: '',
          endTime: '',
          image: null,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create auction.');
    }
  };

  return (
    <>
    <Toaster position="top-center" />
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create a New Auction</h1>
      <form onSubmit={handleCreateAuction}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Auction Title</label>
          <input
            type="text"
            name="title"
            value={auctionData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={auctionData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category</label>
          <select
            name="category"
            value={auctionData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Pulse">Pulse</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Starting Bid</label>
          <input
            type="number"
            name="startingBid"
            value={auctionData.startingBid}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={auctionData.startTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={auctionData.endTime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-green-700 disabled:opacity-50"
          >
          Create Auction
        </button>
      </form>
    </div>
  </>
  );
};

export default AuctionForm;
