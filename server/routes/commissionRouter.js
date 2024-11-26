const express = require('express');
const router = express.Router();
const { auth, isAdmin, isFarmer } = require("../middleware/auth.js");
const commissionController=require('../controller/commissionController.js');


router.post(
  "/proof",
  auth,
  isFarmer,
  commissionController.proofOfCommission
);

module.exports = router;
