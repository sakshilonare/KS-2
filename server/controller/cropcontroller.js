const Crop = require('../models/cropModel');
const cloudinary = require("cloudinary").v2;
const jwt = require('jsonwebtoken'); // Ensure this is imported at the top of your file


exports.createCrop = async (req, res) => {
    try {
        // Check if imageFile exists in the request
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const file = req.files.imageFile;

        // Validation for supported file types
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.').pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({ success: false, message: 'File format not supported' });
        }

        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided, authorization denied" });
        }

        // Verify token and extract farmer ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const farmerId = decodedToken.id;

        // Upload to Cloudinary
        const response = await uploadFileToCloudinary(file, "krishisahyog");

        // Add all details from req.body to the database
        const crop = await Crop.create({
            ...req.body,
             farmer: farmerId,
            cropimage1: response.secure_url // Save the image URL
        });

        res.status(201).json({
            success: true,
            data: crop,
            message: 'Crop created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message
        });
    }
};

exports.deleteCrop = async (req, res) => {
    try {
        const crop = await Crop.deleteOne({ _id: req.params.id }); // Delete crop by ID
        res.status(200).json({
            success: true,
            data: crop,
            message: 'Crop deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message
        });
    }
};

exports.getAllCrops = async (req, res) => {
    try {
        const cropData = await Crop.find(); // Retrieve all crops
        if (cropData.length === 0) {
            return res.status(404).json({ message: "No crops found" });
        }
        res.status(200).json(cropData);
    } catch (error) {
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message
        });
    }
};

exports.getCropById = async (req, res) => {
    try {
        const cropId = req.params.id; // Fetch the correct ID parameter

        const crop = await Crop.findById(cropId); // Retrieve the crop using the provided ID

        if (!crop) {
            return res.status(404).json({ message: "Crop not found" });
        }

        res.status(200).json(crop); // Return crop details
    } catch (error) {
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message,
        });
    }
};

exports.updateCrop = async (req, res) => {
    try {
        const id = req.params.id;
        const cropExist = await Crop.findById(id);
        if (!cropExist) {
            return res.status(404).json({ message: "Crop not found" });
        }
        const updatedCrop = await Crop.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCrop);
    } catch (error) {
        res.status(500).json({
            success: false,
            data: "Internal server error",
            message: error.message
        });
    }
};

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    console.log("temp file path", file.tempFilePath);

    if (quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Image upload handler
exports.imageUpload = async (req, res) => {
    try {
        // Extracting data from the request body
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No token provided, authorization denied" });
        }

        // Verify token and extract farmer ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const farmerId = decodedToken.id;
        const { crop, croptype, email, harvestdate, season, state, pricePerKg, quantity, soiltype, region, description } = req.body;

        // Check if imageFile exists in the request
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const file = req.files.imageFile;

        // Validation for supported file types
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.').pop().toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({ success: false, message: 'File format not supported' });
        }

        // Upload to Cloudinary
        const response = await uploadFileToCloudinary(file, "krishisahyog");
        
        // Save to the database
        const cropData = await Crop.create({
            crop,
            croptype,
            email,
            harvestdate,
            season,
            state,
            pricePerKg,
            quantity,
            soiltype,
            region,
            description,
            farmer: farmerId,
            cropimage1: response.secure_url // Save the image URL
        });

        res.status(201).json({
            success: true,
            cropData,
            message: 'Crop details successfully uploaded',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// const jwt = require('jsonwebtoken'); // Assuming you're using JWT for authentication


exports.getCropsForFarmer = async (req, res) => {
    try {
        // Check for the token in the Authorization header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: "No token provided, authorization denied" });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        const farmerId = decodedToken.id; // Ensure the token has the correct payload structure

        // Find crops added by this farmer
        const crops = await Crop.find({ farmer: farmerId });

        if (!crops || crops.length === 0) {
            return res.status(404).json({ message: "No crops found for this farmer" });
        }

        // Return the crops found
        res.status(200).json(crops);
    } catch (error) {
        console.error("Error fetching crops:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// Image size reducer
exports.imageSizeReducer = async (req, res) => {
    try {
        // Data fetch
        const { crop, croptype, email, harvestdate, season, state, pricePerKg, quantity, soiltype, region, description } = req.body;
        console.log(crop, croptype, email, harvestdate, season, state, pricePerKg, quantity, soiltype, region, description);

        const file = req.files.imageFile; // Assuming the image file is being uploaded under this key
        console.log(file);

        // Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.').pop().toLowerCase();
        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: 'File format not supported',
            });
        }

        // File format supported
        console.log("Uploading to Cloudinary with reduced size");
        const response = await uploadFileToCloudinary(file, "krishisahyog", 90);
        console.log(response);

        // Save to database according to the crop schema
        const cropData = await Crop.create({
            crop,
            croptype,
            email,
            harvestdate,
            season,
            state,
            pricePerKg,
            quantity,
            soiltype,
            region,
            description,
            cropimage1: response.secure_url, // Save the image URL
            // Add more crop images as needed (e.g., cropimage2, cropimage3)
        });

        res.json({
            success: true,
            cropData,
            message: 'Crop details successfully uploaded with reduced image size',
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
}
