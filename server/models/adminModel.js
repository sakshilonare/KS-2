const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
     role: {
        type: String,
        required: true,
        // default: "farmer", // Default role is 'farmer'
        enum: ["farmer", "buyer", "admin"] // You can extend this list if needed
    },
    admin_token:{
        type:String,

    }
   
});

// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next(); // Prevent rehashing if the password is already hashed
//   }
//   console.log("Hashing password during save...");
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

  adminSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
