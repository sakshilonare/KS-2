const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing. Please log in.",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || !payload.id || !payload.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload. Authentication failed.",
      });
    }

    let user;
    if (payload.role === "farmer") {
      const Farmer = require("../models/farmerModel");
      user = await Farmer.findById(payload.id);
    } else if (payload.role === "buyer") {
      const Buyer = require("../models/buyerModel");
      user = await Buyer.findById(payload.id);
    } else if (payload.role === "admin") {
      const Admin = require("../models/adminModel");
      user = await Admin.findById(payload.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Authentication failed.",
      });
    }

    req.user = { id: user._id, role: user.role }; // Attach only essential data
    console.log("Authenticated user:", req.user); // Debugging

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
      error: error.message,
    });
  }
};

const checkRole = (role) => (req, res, next) => {
  try {
    console.log("User role:", req.user?.role); // Debugging
    if (!req.user || req.user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${role}s are allowed.`,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Authorization failed for role ${role}.`,
      error: error.message,
    });
  }
};

exports.isFarmer = checkRole("farmer");
exports.isBuyer = checkRole("buyer");
exports.isAdmin = checkRole("admin");
