import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
// import { Popup } from 'react-leaflet';

const API_KEY = 'a51be103499149a3ae7e10f63a2cfea6'; // Replace with OpenCage API key

const AdminDashboard = () => {
    console.log("AdminDashboard component rendered");

    const [cropLocations, setCropLocations] = useState([]);
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalFarmers: 0,
        totalBuyers: 0,
        totalCrops: 0,
        totalSoldCrops: 0,
        totalBids: 0,
        cropMaxBids: [],
        cropCategories: []
    });
    const [buyerLeaderboard, setBuyerLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Fetching admin stats data...");
    
                // Fetch admin stats data
                const response = await axios.get("http://localhost:3000/api/admin/admin-stats");
    
                // Update dashboard data for general stats and cropMaxBids
                if (response.data) {
                    setDashboardData((prevData) => ({
                        ...prevData,
                        totalUsers: response.data.totalUsers || 0,
                        totalFarmers: response.data.totalFarmers || 0,
                        totalBuyers: response.data.totalBuyers || 0,
                        totalCrops: response.data.totalCrops || 0,
                        totalSoldCrops: response.data.totalSoldCrops || 0,
                        totalBids: response.data.totalBids || 0,
                        cropMaxBids: response.data.cropMaxBids || []
                    }));
                }
    
                // Fetch crop data and geocode locations
                const cropResponse = await axios.get("http://localhost:3000/api/admin/crops");
                if (cropResponse.data) {
                    const crops = cropResponse.data;
    
                    // Geocode each crop location
                    const geocodedCrops = await Promise.all(
                        crops.map(async (crop) => {
                            console.log(`Processing crop: ${crop.crop}, region: ${crop.region}`); // Log each crop's name and region
    
                            const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                                crop.region
                            )}&key=${API_KEY}`;
                            try {
                                const geocodeResponse = await axios.get(geocodeUrl);
                                const { lat, lng } = geocodeResponse.data.results[0].geometry;
                                console.log(`Geocoded location for ${crop.region}: ${lat}, ${lng}`); // Log geocoded latitude and longitude
    
                                return { ...crop, latitude: lat, longitude: lng };
                            } catch (err) {
                                console.error(`Failed to geocode location: ${crop.region}`, err.message);
    
                                return { ...crop, latitude: null, longitude: null };
                            }
                        })
                    );
    
                    setCropLocations(geocodedCrops);
    
                    // Process crop categories after fetching crops
                    const categoryCounts = crops.reduce((acc, crop) => {
                        acc[crop.croptype] = (acc[crop.croptype] || 0) + 1;
                        return acc;
                    }, {});
    
                    const totalCrops = crops.length;
                    const cropCategories = Object.entries(categoryCounts).map(([category, count]) => ({
                        category,
                        percentage: ((count / totalCrops) * 100).toFixed(2)
                    }));
    
                    // Update dashboard with crop categories
                    setDashboardData((prevData) => ({
                        ...prevData,
                        cropCategories
                    }));
                }
    
                const leaderboardResponse = await axios.get("http://localhost:3000/api/admin/buyers", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
    
                if (leaderboardResponse.data && leaderboardResponse.data.success) {
                    // Limit to the top 5 buyers
                    const topBuyers = leaderboardResponse.data.buyers.slice(0, 5);
                    setBuyerLeaderboard(topBuyers);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const cropNames = (dashboardData.cropMaxBids || []).map(item => item.name);
    const maxBidValues = (dashboardData.cropMaxBids || []).map(item => item.maxBid);

    const cropMaxBidChartOptions = {
        chart: { type: 'bar', height: 350 },
        xaxis: {
            categories: cropNames,
            title: { text: 'Crops' }
        },
        yaxis: { title: { text: 'Maximum Bid' } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => `$${val}` } },
        title: { text: 'Crop vs Maximum Bid', align: 'center' },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            }
        },
        responsive: [{
            breakpoint: 768,
            options: {
                plotOptions: {
                    bar: { horizontal: true }
                }
            }
        }]
    };

    const cropMaxBidChartSeries = [{
        name: 'Max Bid',
        data: maxBidValues
    }];

    // Extract data for Crop Categories Donut Chart
    const cropCategoryLabels = dashboardData.cropCategories.map(category => category.category);
    const cropCategorySeries = dashboardData.cropCategories.map(category => parseFloat(category.percentage));

    const donutChartOptions = {
        labels: cropCategoryLabels,
        legend: { position: 'bottom' },
        title: { text: 'Crop Categories Distribution (%)', align: 'center' },
        tooltip: {
            y: { formatter: (val) => `${val.toFixed(2)}%` }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-black-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

            {/* Dashboard summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                {Object.keys(dashboardData).slice(0, 6).map((key, index) => (
                    <div key={index} className="bg-black shadow-lg rounded-lg p-6 text-center">
                        <h2 className="text-xl font-semibold">{key.replace(/([A-Z])/g, ' $1')}</h2>
                        <p className="text-2xl font-bold">{dashboardData[key]}</p>
                    </div>
                ))}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                {/* <div className="bg-white shadow-lg rounded-lg p-6">
                    <Chart options={cropMaxBidChartOptions} series={cropMaxBidChartSeries} type="bar" height={350} />
                </div> */}
                {/* Crop Categories Donut Chart */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <Chart options={donutChartOptions} series={cropCategorySeries} type="donut" height={350} />
                </div>
            </div>

            {/* Buyer Leaderboard */}
            <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-gray-900 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Buyer Leaderboard</h2>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-slate-700 shadow-lg rounded-lg">
                            <th className="border border-gray-200 p-2">Rank</th>
                            <th className="border border-gray-200 p-2">Name</th>
                            <th className="border border-gray-200 p-2">Email</th>
                            <th className="border border-gray-200 p-2">Auctions Won</th>
                            <th className="border border-gray-200 p-2">Money Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyerLeaderboard.map((buyer, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-200 p-2">{index + 1}</td>
                                <td className="border border-gray-200 p-2">{buyer.name}</td>
                                <td className="border border-gray-200 p-2">{buyer.email}</td>
                                <td className="border border-gray-200 p-2">{buyer.auctionsWon}</td>
                                <td className="border border-gray-200 p-2">{buyer.moneySpent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>

            {/* Map section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Crop Locations</h2>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {cropLocations.map((crop, index) =>
                        crop.latitude && crop.longitude && (
                            <CircleMarker
                                key={index}
                                center={[crop.latitude, crop.longitude]}
                                radius={8}
                                color="red"
                                fillColor="red"
                                fillOpacity={0.6}
                                weight={1}
                            >
                                <Popup>
                                    <strong>Crop:</strong> {crop.crop} <br />
                                    <strong>Location:</strong> {crop.region}<br />
                                    {/* <strong>Farmer:</strong>{crop.farmerName} */}
                                </Popup>
                            </CircleMarker>
                        )
                    )}
                </MapContainer>
            </div>



        </div>
    );
};

export default AdminDashboard;
