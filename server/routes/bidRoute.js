const express = require('express');
const router = express.Router();
const bidController=require('../controller/bidcontroller.js');
const { auth, isBuyer, isAdmin } = require("../middleware/auth.js");
const { checkAuctionEndTime } = require("../middleware/checkAuctionEndTime.js");

router.post(
  "/place/:id",
  auth,
  isBuyer,
  checkAuctionEndTime,
  bidController.placeBid
);

module.exports = router;
