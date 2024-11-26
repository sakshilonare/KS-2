const express = require('express');
const router = express.Router();
const farmerController = require('../controller/farmercontroller');
const { login, signup } = require("../controller/Auth");
const { auth, isFarmer, isBuyer, isAdmin } = require("../middleware/auth");

// Define routes
// Create a farmer (Only authenticated farmers can add farmers)
router.post('/addfarmers', auth, isFarmer, farmerController.createFarmer);

// Get all farmers (Accessible by anyone, no need for auth here, but you can add it if necessary)
router.get('/getfarmers', farmerController.getAllFarmers);

// Get a specific farmer by ID (Only authenticated users should be able to view details of specific farmers)
router.get('/getfarmer/:id', auth, farmerController.getFarmerById);

// Update a farmer by ID (Only authenticated farmers should be able to update their own information)
router.put('/updatefarmers/:id', auth, isFarmer, farmerController.updateFarmer);

// Delete a farmer by ID (Only authenticated farmers should be able to delete their own account)
router.delete('/deletefarmers/:id', auth, isFarmer, farmerController.deleteFarmer);

// Login route (Public access)
router.post('/login', login);

// Signup route (Public access)
router.post('/signup', signup);

// Farmer dashboard (Only accessible by authenticated farmers)
router.get("/farmer/dashboard", auth, isFarmer, (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Farmer!" });
});

module.exports = router;
