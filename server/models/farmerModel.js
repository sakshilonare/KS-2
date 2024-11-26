const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Define the Farmer schema
const farmerSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true

    },
    profilePicture: {
        type: String, // You can store the path to the image file
        required: false // Not required as it's optional
    },
    farmAddress: {
        type: String,
        required: true
    },
    farmSize: {
        type: String,
        required: true
    },
    farmingType: {
        type: String,
        required: true
    },
    farmingExperience: {
        type: String,
        required: true
    },
    farmingPracticesDescription: {
        type: String,
        required: true
    },
    // cropFieldImage: {
    //     type: String, // You can store the path to the image file
    //     required: false // Not required as it's optional
    // },
    State: {
        type: String,
        required: true
    },
    Region: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "farmer", // Default role is 'farmer'
        enum: ["farmer", "buyer", "admin"] // You can extend this list if needed
    },
    unpaidCommission: {
        type: Number,
        default: 0,
      },
    moneySpent: {
        type: Number,
        default: 0,
      },
    farmer_token:{
        type:String,

    }
});

// Create the Farmer model

const nodemailer = require("nodemailer");

// After saving the farmer, send a welcome email
farmerSchema.post("save", async function(doc) {
    try {
        console.log("DOC", doc);

        // Configure Nodemailer
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        // Send Email
        let info = await transporter.sendMail({
            from: `KrishiSahyog <${process.env.MAIL_USER}>`, // Sender name and email
            to: doc.email, // Send to the farmer's email
            subject: "Welcome to KrishiSahyog",
            html: `
                <h3>Dear ${doc.name},</h3>
                <p>Welcome to KrishiSahyog! We are excited to have you as a part of our platform where farmers and buyers can connect directly.</p>
                <p>Your farming details have been successfully added to our platform. You can now start adding your crops and interacting with buyers.</p>
                <p><strong>Your Details:</strong></p>
                <ul>
                    <li><strong>Full Name:</strong> ${doc.name}</li>
                    <li><strong>Email:</strong> ${doc.email}</li>
                    <li><strong>Mobile Number:</strong> ${doc.mobile}</li>
                    <li><strong>Farm Address:</strong> ${doc.farmAddress}</li>
                    <li><strong>Farm Size:</strong> ${doc.farmSize}</li>
                    <li><strong>Farming Type:</strong> ${doc.farmingType}</li>
                    <li><strong>State:</strong> ${doc.State}</li>
                    <li><strong>Region:</strong> ${doc.Region}</li>
                </ul>
                <p>Thank you for joining KrishiSahyog! We're here to support you in growing your farming business.</p>
                <p>Best Regards,</p>
                <p>The KrishiSahyog Team</p>
            `,
        });

        console.log("Welcome email sent successfully:", info);

    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
});

// farmerSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       next();
//     }
//     this.password = await bcrypt.hash(this.password, 10);
//   });
  
//   farmerSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
//   };
  
//   farmerSchema.methods.generateJsonWebToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: process.env.JWT_EXPIRE,
//     });
//   };


const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;
