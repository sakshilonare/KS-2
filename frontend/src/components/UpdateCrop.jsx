import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FarmerNav from './FarmerNav';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const UpdateCrop = () => {
  const [cropData, setCropData] = useState({
    cropname: '',
    startdate: new Date().toISOString().slice(0, 10),
    enddate: '',
    email: '',
    cropimage1: {
      data: null,
      contentType: ''
    },
    cropimage2: {
      data: null,
      contentType: ''
    },
    basePrice: 0,
    type: '',
    category: '',
    weight: 0,
    harvestdate:'',
    season:'',
    region: '',
    state: '',
    description: ''
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/crops/${id}`);
        setCropData(response.data); // Assuming response.data is the correct shape for cropData
      } catch (error) {
        console.error('Error fetching crop data:', error);
        // Handle error
      }
    };

    fetchData(); // Call the async function immediately
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCropData({ ...cropData, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setCropData({
        ...cropData,
        [name]: {
          data: reader.result,
          contentType: file.type
        }
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/updatecrop/${id}`, cropData);
      console.log(response.data);
      toast.success('Crop updated successfully!');
    } catch (error) {
      console.error('Error updating crop:', error);
      toast.error('Error updating crop. Please try again later.');
    }
  };


  return (
    <>
    <FarmerNav/>
    <div className="max-w-lg mx-auto p-4">
  <h2 className="text-2xl font-bold mb-4">Add Crop</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label htmlFor="cropname">Crop Name:</label>
      <input type="text" name="cropname" value={cropData.cropname} onChange={handleChange} placeholder="Crop Name" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <label htmlFor="startdate">Start Date:</label>
      <input type="date" name="startdate" value={cropData.startdate} onChange={handleChange} required className="border rounded-md px-3 py-2" disabled/>
      <label htmlFor="enddate">End Date:</label>
      <input type="date" name="enddate" value={cropData.enddate} onChange={handleChange} required className="border rounded-md px-3 py-2" />
    </div>
    <div>
      <label htmlFor="email">Email:</label>
      <input type="email" name="email" value={cropData.email} onChange={handleChange} placeholder="Email" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <label htmlFor="cropimage1">Crop Image 1:</label>
      <input type="file" name="cropimage1" onChange={handleImageChange} className="border rounded-md px-3 py-2" />
      <label htmlFor="cropimage2">Crop Image 2:</label>
      <input type="file" name="cropimage2" onChange={handleImageChange} className="border rounded-md px-3 py-2" />
    </div>
    <div>
      <label htmlFor="basePrice">Base Price:</label>
      <input type="number" name="basePrice" value={cropData.basePrice} onChange={handleChange} placeholder="Base Price" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div>
      <label htmlFor="type">Type:</label>
      <select name="type" value={cropData.type} onChange={handleChange} required className="border rounded-md px-3 py-2 w-full">
        <option value="">Select Type</option>
        <option value="fruit">Fruit</option>
        <option value="vegetable">Vegetable</option>
      </select>
    </div>
    <div>
      <label htmlFor="category">Category:</label>
      <input type="text" name="category" value={cropData.category} onChange={handleChange} placeholder="Category" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div>
      <label htmlFor="weight">Weight:</label>
      <input type="number" name="weight" value={cropData.weight} onChange={handleChange} placeholder="Weight" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div>
      <label htmlFor="region">Region:</label>
      <input type="text" name="region" value={cropData.region} onChange={handleChange} placeholder="Region" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div>
      <label htmlFor="state">State:</label>
      <input type="text" name="state" value={cropData.state} onChange={handleChange} placeholder="State" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div>
      <label htmlFor="harvestdate">Harvest Date:</label>
      <input type="date" name="harvestdate" value={cropData.harvestdate} onChange={handleChange} required className="border rounded-md px-3 py-2"/>
    </div>
    <div>
      <label htmlFor="season">Season</label>
      <input type="text" name="season" value={cropData.season} onChange={handleChange} placeholder="Season" required className="border rounded-md px-3 py-2 w-full" />
    </div>
    <div>
      <label htmlFor="description">Description:</label>
      <textarea name="description" value={cropData.description} onChange={handleChange} placeholder="Description" className="border rounded-md px-3 py-2 w-full"></textarea>
    </div>
    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md w-full">Add Crop</button>
  </form>
</div>

    </>
  );
  
};

export default UpdateCrop;
