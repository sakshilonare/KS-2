const express = require('express');
const router = express.Router();
const adminController = require('../controller/admincontroller');
const { login, signup } = require("../controller/Auth");
const { auth, isFarmer, isBuyer, isAdmin } = require("../middleware/auth");

// router.get('/farmers', adminController.getAllFarmers);
// router.get('/buyers', adminController.getAllBuyers);

// router.get('/crops', adminController.getAllCrops);
// router.delete('/delete-crop/:cropId', adminController.deleteCrop);
// router.put('/crop/:cropId', adminController.updateCrop);
// router.get('/admin-stats', adminController.getAdminStats);
// router.get('/crop/:cropId/bids', adminController.getBidsForCrop);
// router.delete('/bid/:bidId', adminController.deleteBid);
router.put('/update-crop/:cropId',auth,adminController.updateCrop);
// router.post('/blockuser')
// / Login route (Public access)
// router.post('/login', login);
router.post('/blockuser/:userId/:userType',auth,adminController.blockUser); // Example URL: /blockUser/123/farmer
router.post('/unblockuser/:userId/:userType',auth, adminController.unblockUser); // Example URL: /unblockUser/123/farmer
// Signup route (Public access)
// router.post('/signup', signup);





// Define routes and link them to controller functions
router.get('/farmers', auth,adminController.getAllFarmers);
router.get('/buyers', auth,adminController.getBuyerDetails);
router.get('/buyers-all', auth,adminController.getAllBuyers);

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
    adminController.getAllPaymentProofs
  );
  
  router.get(
    "/paymentproofs/:id",
    auth,
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
