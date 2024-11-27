const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const farmerModel = require("../models/farmerModel");
const buyerModel = require("../models/buyerModel");
const adminModel = require("../models/adminModel");
require("dotenv").config();

// Signup route handler
exports.signup = async (req, res) => {
  try {
    const {
      name, 
      email, 
      password, 
      role, 
      mobile, 
      address,
      dateOfBirth,
      gender,
      profilePicture,
      farmAddress,
      farmSize,
      farmingType,
      farmingExperience,
      farmingPracticesDescription,
      cropFieldImage,
      State,
      Region
    } = req.body; // Destructure the request body

    // Ensure role is valid
    const validRoles = ["farmer", "buyer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Choose from farmer, buyer, or admin.",
      });
    }

    // Check if the user exists in the respective model
    let existingUser;
    if (role === "farmer") existingUser = await farmerModel.findOne({ email });
    else if (role === "buyer") existingUser = await buyerModel.findOne({ email });
    else if (role === "admin") existingUser = await adminModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the respective model
    let newUser;
    if (role === "farmer") {
      newUser = await farmerModel.create({ 
        name, 
        email, 
        mobile: mobile, // Map mobile to mobileNumber
        password: hashedPassword, // Store the hashed password
        dateOfBirth,
        gender,
        profilePicture,
        farmAddress,
        farmSize,
        farmingType,
        farmingExperience,
        farmingPracticesDescription,
        cropFieldImage,
        State,
        Region,
        role // Include role
      });
    } else if (role === "buyer") {
      newUser = await buyerModel.create({ 
        name, 
        email, 
        password: hashedPassword, // Store the hashed password
        role, 
        mobile: mobile, // Include mobile
        address 
      });
    } else if (role === "admin") {
      newUser = await adminModel.create({ 
        name, 
        email, 
        password: hashedPassword, // Store the hashed password
        role, 
        mobile: mobile, // Include mobile
        address // Include address
      });
    }

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully.`,
    });
  } catch (error) {
    console.error('Signup Error:', error); // More detailed error logging
    return res.status(500).json({
      success: false,
      message: "Error during signup.",
    });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate that all fields are provided
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all login details.",
      });
    }

    // Find the user in the respective model
    let user;
    if (role === "farmer") {
      user = await farmerModel.findOne({ email });
    } else if (role === "buyer") {
      user = await buyerModel.findOne({ email });
    } else if (role === "admin") {
      user = await adminModel.findOne({ email });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified.",
      });
    }

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({
        success: false,
        message: "Password incorrect.",
      });
    }

    // Generate JWT
    const payload = {
      id: user._id,
      role: user.role, // Use the role from the user object
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    // If the role is farmer, store the token in the farmer's document
    if (role === "farmer") {
      user.famer_token = token; // Assuming your farmer model has a 'famer_token' field
      await user.save(); // Save the updated farmer model with the token
    }

    // Remove password from user object before sending response
    const userResponse = user.toObject();
    userResponse.password = undefined;

    // Set the token in a cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    return res
      .cookie("authCookie", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user: userResponse,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully.`,
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

exports.blockUser = async (req, res) => {
  const { userId, userType } = req.body;

  if (!userId || !userType) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: userId or userType.",
    });
  }

  if (userType !== "farmer" && userType !== "buyer") {
    return res.status(400).json({
      success: false,
      message: "Invalid userType. Must be 'farmer' or 'buyer'.",
    });
  }

  const Model = userType === "farmer" ? farmer : buyer;
  const user = await Model.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `${userType} not found.`,
    });
  }

  try {
    // Attempt to block/unblock the user
    user.isBlocked = true;
    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: `${userType} has been blocked successfully.`,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Specific validation error handling
      return res.status(400).json({
        success: false,
        message: `Validation error: ${error.message}`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      });
    }
  }
};

