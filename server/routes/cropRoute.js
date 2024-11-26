const express = require('express');
const router = express.Router();

// Import controller
const { createCrop, getAllCrops, updateCrop,deleteCrop, imageUpload, imageSizeReducer, getCropById,getCropsForFarmer } = require('../controller/cropcontroller');

// Define API routes
router.post('/createcrop', createCrop);              // Create a new crop
router.get('/cropdata', getAllCrops);                // Get all crops
router.get('/cropdetails/:id', getCropById);         // Get crop details by ID (fixing route comment)

router.put('/updatecrop/:id', updateCrop);           // Update crop details by ID
router.delete('/deletecrop/:id', deleteCrop);        // Delete crop by ID (if applicable, otherwise create a delete controller)
router.post("/imageUpload", imageUpload);
router.get("/mycrops",getCropsForFarmer);            // Upload image for crops

module.exports = router;
