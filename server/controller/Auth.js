const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const farmerModel = require("../models/farmerModel.js");
const buyerModel = require("../models/buyerModel.js");
const adminModel = require("../models/adminModel.js");
const { sendEmail } = require("../utils/sendEmail");
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
      Region,
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
        password: hashedPassword, // Store the hashed password
        mobile,
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
        role,
      });
    } else if (role === "buyer") {
      newUser = await buyerModel.create({
        name,
        email,
        password: hashedPassword, // Store the hashed password
        role,
        mobile,
        address,
      });
    } else if (role === "admin") {
      newUser = await adminModel.create({
        name,
        email,
        password: hashedPassword, // Store the hashed password
        role,
        mobile,
        address,
      });
    }

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully.`,
    });
  } catch (error) {
    console.error("Signup Error:", error); // Detailed error logging
    return res.status(500).json({
      success: false,
      message: "Error during signup.",
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all login details.",
      });
    }

    let user;
    if (role === "admin") {
      user = await adminModel.findOne({ email });
    } else if (role === "farmer") {
      user = await farmerModel.findOne({ email });
    } else if (role === "buyer") {
      user = await buyerModel.findOne({ email });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    // Password comparison
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json({ success: false, message: "Password incorrect." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Send email after successful login
    const subject = `Welcome Back, ${user.name}!`;
    let message;

    // Custom email message based on role
    if (role === "farmer") {
      message = `
        Dear ${user.name},
        
        You have successfully logged into **KrishiSahyog** as a farmer.

        Here are your details:
        - Name: ${user.name}
        - Email: ${user.email}
        - Role: Farmer
        - Farm Address: ${user.farmAddress || "Not provided"}
        - Farm Size: ${user.farmSize || "Not provided"}
        
        If you need any help, feel free to contact us at xyz@gmail.com.

        Best regards,
        KS-Team
      `;
    } else if (role === "buyer") {
      message = `
        Dear ${user.name},
        
        You have successfully logged into **KrishiSahyog** as a buyer.

        Here are your details:
        - Name: ${user.name}
        - Email: ${user.email}
        - Role: Buyer
        
        We are excited to have you participate in our auctions. If you need any assistance, feel free to contact us at xyz@gmail.com.

        Best regards,
        KS-Team
      `;
    } else if (role === "admin") {
      message = `
        Dear ${user.name},
        
        You have successfully logged into **KrishiSahyog** as an admin.

        Here are your details:
        - Name: ${user.name}
        - Email: ${user.email}
        - Role: Admin
        
        If you have any issues or need further assistance, please contact xyz@gmail.com.

        Best regards,
        KS-Team
      `;
    }

    // Send the email
    await sendEmail({ email: user.email, subject, message });

    return res.status(200).json({
      success: true,
      token,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully.`,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
};

