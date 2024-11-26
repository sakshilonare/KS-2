const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // Import Nodemailer
const Farmer = require('./farmerModel');

// Define Crop Schema
const cropSchema = new mongoose.Schema({
    crop: {
        type: String,
        required: true
    },
    croptype: {
        type: String,
        enum: ['pulses', 'fruit', 'vegetable'],  // Enum for crop types
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // Simple email format validation
    },
    harvestdate: {
        type: Date,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number, // Quantity in kg
        required: true
    },
    soiltype: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "" // Default to an empty string if not provided
    },
    cropimage1: {
        type: String // For storing image URL or file path
    },
    // cropimage2: {
    //     type: String // For storing image URL or file path
    // },
    // cropimage3: {
    //     type: String // For storing image URL or file path
    // },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmerModel' // Reference to the Farmer model
        // required: true  // Farmer is required for each crop
    },
    farmer_token:{
        type:String,
        ref: 'farmerModel'
    }

});

// Create Crop model
cropSchema.post("save", async function(doc) {
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
            from: `Krishisahyog <${process.env.MAIL_USER}>`, // Make sure to include a sender name and email
            to: doc.email,
            subject: "Crop Added Successfully",
            html: `
                <h3>Dear User,</h3>
                <p>Your crop has been successfully added to the platform.</p>
                <p><strong>Crop Details:</strong></p>
                <ul>
                    <li><strong>Crop Name:</strong> ${doc.crop}</li>
                    <li><strong>Crop Type:</strong> ${doc.croptype}</li>
                    <li><strong>Harvest Date:</strong> ${new Date(doc.harvestdate).toLocaleDateString()}</li>
                    <li><strong>Price per Kg:</strong> ${doc.pricePerKg}</li>
                    <li><strong>Quantity (in kg):</strong> ${doc.quantity}</li>
                    <li><strong>Region:</strong> ${doc.region}</li>
                    <li><strong>State:</strong> ${doc.state}</li>
                    <li><strong>Season:</strong> ${doc.season}</li>
                   
                </ul>
                <p>Thank you for using KrishiSahyog!</p>
            `,
        });

        console.log("Email sent successfully:", info);

    } catch (error) {
        console.error("Error sending email:", error);
    }
});

// Create and export Crop model
const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
