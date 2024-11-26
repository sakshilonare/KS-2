const express = require('express');
const router = express.Router();
const { auth, isFarmer, isBuyer, isAdmin } = require("../middleware/auth");
const buyerController = require('../controller/buyercontroller');
const {login,signup}=require("../controller/Auth");
// const { auth, isFarmer, isBuyer, isAdmin } = require("../middleware/auth");



// Route to create a new buyer
router.post('/createbuyer', buyerController.createBuyer);

// Route to get all buyers
router.get('/allbuyers', buyerController.getAllBuyers);

// Route to get a single buyer by ID
router.get('/buyer/:id', buyerController.getBuyerById);

// Route to update a buyer by ID
router.put('/updatebuyer/:id', buyerController.updateBuyerById);

// Route to delete a buyer by ID
router.delete('/deletebuyer/:id', buyerController.deleteBuyerById);
router.post('/login',login);
router.post('/signup',signup);
router.get("/buyer/dashboard", auth, isBuyer, (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Buyer!" });
});
module.exports = router;
