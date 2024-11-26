const express = require('express');
const router = express.Router();
const auctionController = require('../controller/auctionController.js');
const { auth, isFarmer, isAdmin } = require("../middleware/auth.js");
const { trackCommissionStatus } = require("../middleware/trackCommissionStatus.js");

// Middleware for multiple roles
const checkRoles = (...roles) => (req, res, next) => {
  try {
    if (!req.user || !roles.includes(req.user.role.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(" or ")} can access this route.`,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization error.",
      error: error.message,
    });
  }
};

// Routes
router.post("/create", auth, isFarmer, trackCommissionStatus, auctionController.addNewAuctionItem);
router.get("/allitems", auctionController.getAllItems);
router.get("/auctionDetail/:id", auth, checkRoles("farmer", "buyer"), auctionController.getAuctionDetails);
router.get("/myitems", auth, isFarmer, auctionController.getMyAuctionItems);
router.delete("/delete/:id", auth, isFarmer, auctionController.removeFromAuction);
router.put("/item/republish/:id", auth, isFarmer, auctionController.republishItem);

module.exports = router;
