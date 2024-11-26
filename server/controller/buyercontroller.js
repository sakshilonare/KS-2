const Buyer = require('../models/buyerModel');

// Controller function to create a new buyer
const createBuyer = async (req, res) => {
    try {
        const { name, mobile, email, address, password } = req.body;
        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const newBuyer = new Buyer({ name, mobile, email, address, password });
        await newBuyer.save();
        res.status(201).json({ message: "Buyer created successfully", buyer: newBuyer });
    } catch (error) {
        console.error("Error creating buyer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller function to get all buyers
const getAllBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find();
        res.status(200).json({ buyers });
    } catch (error) {
        console.error("Error fetching buyers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller function to get a single buyer by ID
const getBuyerById = async (req, res) => {
    try {
        const { id } = req.params;
        const buyer = await Buyer.findById(id);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }
        res.status(200).json({ buyer });
    } catch (error) {
        console.error("Error fetching buyer by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller function to update a buyer by ID
const updateBuyerById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile, email, address, password } = req.body;
        const updatedBuyer = await Buyer.findByIdAndUpdate(id, { name, mobile, email, address, password }, { new: true });
        if (!updatedBuyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }
        res.status(200).json({ message: "Buyer updated successfully", buyer: updatedBuyer });
    } catch (error) {
        console.error("Error updating buyer by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller function to delete a buyer by ID
const deleteBuyerById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBuyer = await Buyer.findByIdAndDelete(id);
        if (!deletedBuyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }
        res.status(200).json({ message: "Buyer deleted successfully" });
    } catch (error) {
        console.error("Error deleting buyer by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createBuyer, getAllBuyers, getBuyerById, updateBuyerById, deleteBuyerById };
