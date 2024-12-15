const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


// Define the Buyer schema
const buyerSchema = new mongoose.Schema({
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
        default: "farmer", // Default role is 'farmer'
        enum: ["farmer", "buyer", "admin"] // You can extend this list if needed
    },
    auctionsWon: {
        type: Number,
        default: 0,
      },
    moneySpent: {
        type: Number,
        default: 0,
      },
    buyer_token:{
        type:String,

    },
    isBlocked: { type: Boolean, default: false }
});



// Create the Buyer model
const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
