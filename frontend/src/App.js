import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Registration from './components/Registration';
import Login from './components/Login';
import Feedback from './components/Feedback';
import CropForm from './components/CropForm';
import FarmerNav from './components/FarmerNav';
import BuyerNav from './components/BuyerNav';
import AdminNav from './components/AdminNav';
import Allcrops from './components/Allcrops';
import MyCropList from './components/MyCropList';
import CropDetails from './components/CropDetails';
import CartPage from './components/CartPage';
import Orders from './components/Orders';
import { CartProvider } from './components/CartContext';
import AdminDashboard from './components/AdminDashboard';
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import ManageCrops from './components/ManageCrops';
import AuctionPage from './components/AuctionPage';
import AuctionForm from './components/AuctionForm';
import MyAuctionList from './components/MyAuctionList';
import Leaderboard from './components/LeaderBoard';
import ProfilePage from './components/ProfilePage';
import PaymentProofsPage from './components/PaymentProofsPage';
import Chat from './components/Chat';
import ManageUsers from './components/ManageUsers';


const App = () => {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            {/* General Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat/>} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/cropform" element={<CropForm />} />
            <Route path="/auction/leaderboard/:auctionId" element={<Leaderboard />} />

            {/* Farmer Routes */}
            <Route path="/farmer" element={<FarmerNav />}>
              <Route path="all-crops" element={<Allcrops />} />
              <Route path="add-crop" element={<CropForm />} />
              <Route path="my-crop-list" element={<MyCropList />} />
              <Route path="my-auction-list" element={<MyAuctionList />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="auction" element={<AuctionPage />} />
              <Route path="create-auction" element={<AuctionForm />} />
              <Route path="cropdetails/:cropId" element={<CropDetails />} />
            </Route>

            {/* Buyer Routes */}
            <Route path="/buyer" element={<BuyerNav />}>
              <Route path="all-crops" element={<Allcrops />} />
              <Route path="cropdetails/:cropId" element={<CropDetails />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="orders" element={<Orders />} />
              <Route path="auction" element={<AuctionPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminNav />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage-crops" element={<ManageCrops />} />
              <Route path="/admin/paymentproofs" element={<PaymentProofsPage/>} />
              <Route path="manage-users" element={<ManageUsers />} />
            </Route>

          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
