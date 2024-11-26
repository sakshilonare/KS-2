const express = require('express');
const router = express.Router();
const adminController = require('../controller/admincontroller');
const { login, signup } = require("../controller/Auth");
const { auth, isFarmer, isBuyer, isAdmin } = require("../middleware/auth");



// Define routes and link them to controller functions
router.get('/farmers', auth, isAdmin, adminController.getAllFarmers);
router.get('/buyers',auth, isAdmin, adminController.getBuyerDetails);
router.get('/crops', adminController.getAllCrops);
router.delete('/delete-crop/:cropId', adminController.deleteCrop);
router.put('/crop/:cropId', adminController.updateCrop);
router.get('/admin-stats', adminController.getAdminStats);
router.delete(
    "/auctionitem/delete/:id",
    auth,
    isAdmin,
    adminController.deleteAuctionItem
  );

  router.get(
    "/paymentproofs/getall",
    auth,
    isAdmin,
    adminController.getAllPaymentProofs
  );
  
  router.get(
    "/paymentproofs/:id",
    auth,isAdmin,
    adminController.getPaymentProofDetail
  );
  
  router.put(
    "/paymentproofs/status/update/:id",
    auth,isAdmin,
    adminController.updateProofStatus
  );
  
  router.delete(
    "/paymentproofs/delete/:id",
    auth,isAdmin,
    adminController.deletePaymentProof
  );


// / Login route (Public access)
router.post('/login', login);

// Signup route (Public access)
router.post('/signup', signup);


module.exports = router;
