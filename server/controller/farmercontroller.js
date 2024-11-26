const Farmer = require('../models/farmerModel');
const cloudinary = require("cloudinary").v2;
const jwt = require('jsonwebtoken');

// Helper function to check if the file type is supported
const isFileTypeSupported = (fileType, supportedTypes) => {
    return supportedTypes.includes(fileType);
};

// Helper function to upload files to Cloudinary
const uploadFileToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.tempFilePath, { folder: folder }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

// Create a new farmer
exports.createFarmer = async (req, res) => {
    try {
        const { 
            fullName, email, mobile, dateOfBirth, gender, 
            farmAddress, farmSize, farmingType, farmingExperience, 
            farmingPracticesDescription, State, Region 
        } = req.body;

        let profilePictureUrl = null;
        let cropFieldImageUrl = null;

        // Handle image uploads if files are provided
        if (req.files) {
            const profilePictureFile = req.files.profilePicture;
            const cropFieldImageFile = req.files.cropFieldImage;

            const supportedTypes = ["jpg", "jpeg", "png"];
            if (profilePictureFile) {
                const profilePictureType = profilePictureFile.name.split('.').pop().toLowerCase();
                if (isFileTypeSupported(profilePictureType, supportedTypes)) {
                    const profilePictureResponse = await uploadFileToCloudinary(profilePictureFile, "krishisahyog");
                    profilePictureUrl = profilePictureResponse.secure_url;
                } else {
                    return res.status(400).json({ success: false, message: 'Profile picture file format not supported' });
                }
            }

            if (cropFieldImageFile) {
                const cropFieldImageType = cropFieldImageFile.name.split('.').pop().toLowerCase();
                if (isFileTypeSupported(cropFieldImageType, supportedTypes)) {
                    const cropFieldImageResponse = await uploadFileToCloudinary(cropFieldImageFile, "krishisahyog");
                    cropFieldImageUrl = cropFieldImageResponse.secure_url;
                } else {
                    return res.status(400).json({ success: false, message: 'Crop field image file format not supported' });
                }
            }
        }

        // Create a new farmer instance
        const newFarmer = new Farmer({
            fullName,
            email,
            mobile,
            dateOfBirth,
            gender,
            profilePicture: profilePictureUrl, // Save the profile picture URL
            farmAddress,
            farmSize,
            farmingType,
            farmingExperience,
            farmingPracticesDescription,
            cropFieldImage: cropFieldImageUrl, // Save the crop field image URL
            State,
            Region,
        });

        // Save the farmer to the database
        const savedFarmer = await newFarmer.save();

        res.status(201).json({
            success: true,
            data: savedFarmer,
            message: 'Farmer data saved successfully'
        });
    } catch (error) {
        console.error('Error saving farmer data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save farmer data',
            error: error.message
        });
    }
};

// Get all farmers
exports.getAllFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find(); // Fetch all farmers
        res.status(200).json({
            success: true,
            data: farmers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch farmers',
            error: error.message
        });
    }
};

// Get a single farmer by ID
exports.getFarmerById = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }
        res.status(200).json({
            success: true,
            data: farmer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch farmer',
            error: error.message
        });
    }
};

exports.updateFarmer = async (req, res) => {
    try {
        const farmerId = req.params.id;

        // Handle image uploads if files are provided
        let profilePictureUrl = req.body.profilePicture;  // Keep the existing URL if no new image is uploaded
        let cropFieldImageUrl = req.body.cropFieldImage;  // Keep the existing URL if no new image is uploaded

        if (req.files) {
            const profilePictureFile = req.files.profilePicture;
            const cropFieldImageFile = req.files.cropFieldImage;

            const supportedTypes = ["jpg", "jpeg", "png"];

            if (profilePictureFile) {
                const profilePictureType = profilePictureFile.name.split('.').pop().toLowerCase();
                if (isFileTypeSupported(profilePictureType, supportedTypes)) {
                    const profilePictureResponse = await uploadFileToCloudinary(profilePictureFile, "krishisahyog");
                    profilePictureUrl = profilePictureResponse.secure_url;
                } else {
                    return res.status(400).json({ success: false, message: 'Profile picture file format not supported' });
                }
            }

            if (cropFieldImageFile) {
                const cropFieldImageType = cropFieldImageFile.name.split('.').pop().toLowerCase();
                if (isFileTypeSupported(cropFieldImageType, supportedTypes)) {
                    const cropFieldImageResponse = await uploadFileToCloudinary(cropFieldImageFile, "krishisahyog");
                    cropFieldImageUrl = cropFieldImageResponse.secure_url;
                } else {
                    return res.status(400).json({ success: false, message: 'Crop field image file format not supported' });
                }
            }
        }

        // Update the farmer details, including new images if provided
        const updatedFarmer = await Farmer.findByIdAndUpdate(farmerId, {
            ...req.body,
            profilePicture: profilePictureUrl,  // Save the new or existing profile picture URL
            cropFieldImage: cropFieldImageUrl,  // Save the new or existing crop field image URL
        }, { new: true });

        if (!updatedFarmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedFarmer,
            message: 'Farmer updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update farmer',
            error: error.message
        });
    }
};

// Delete a farmer
exports.deleteFarmer = async (req, res) => {
    try {
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!deletedFarmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Farmer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete farmer',
            error: error.message
        });
    }
};
