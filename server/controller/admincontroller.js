const Admin = require('../models/adminModel');
const Bidder = require('../models/bidModel');
const Farmer = require('../models/farmerModel');
const Crop = require('../models/cropModel'); // Assuming you have a Crop model
const Buyer = require('../models/buyerModel');
const Auction = require('../models/auctionModel.js');
const PaymentProof = require('../models/commissionProofSchema.js');
const Commission = require('../models/commissionModel.js');
const { catchAsyncErrors } = require('../middleware/catchAsyncErrors.js');
const { ErrorHandler } = require('../middleware/error.js');
const mongoose = require('mongoose');

// Controller to get all farmers
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

// // Controller to get all buyers
// exports.getAllBuyers = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const buyers = await Buyer.find(); // Fetch all buyers from the database
//     res.status(200).json({
//       success: true,
//       data: buyers,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch buyers',
//       error: error.message,
//     });
//   }
// });


exports.getBuyerDetails = catchAsyncErrors(async (req, res, next) => {
  try {
      const buyers = await Buyer.find({})
          .select("name email auctionsWon moneySpent") 
          .sort({ auctionsWon: -1 }); 

      if (!buyers || buyers.length === 0) {
          return res.status(200).json({
              success: true,
              message: "No buyers found.",
              buyers: [],
          });
      }

      res.status(200).json({
          success: true,
          buyers,
      });
  } catch (error) {
      return next(new ErrorHandler("Error fetching buyer details.", 500));
  }
});


// Controller to get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a crop
exports.deleteCrop = async (req, res) => {
  const { cropId } = req.params;
  try {
    const deletedCrop = await Crop.findByIdAndDelete(cropId);
    if (!deletedCrop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.status(200).json({ message: 'Crop deleted successfully', deletedCrop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to update crop details
exports.updateCrop = async (req, res) => {
  const { cropId } = req.params;
  const updatedData = req.body;
  try {
    const updatedCrop = await Crop.findByIdAndUpdate(cropId, updatedData, { new: true });
    if (!updatedCrop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.status(200).json({ message: 'Crop updated successfully', updatedCrop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get total stats for admin dashboard
// Assuming you have models for Farmer, Buyer, Crop, and Bidder
exports.getAdminStats = async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments();
    const totalBuyers = await Buyer.countDocuments();
    const totalUsers = totalFarmers + totalBuyers;
    const totalCrops = await Crop.countDocuments();
    const totalBids = await Bidder.countDocuments();

    // Count of sold crops
    const totalSoldCrops = await Crop.countDocuments({ isSold: true });

    // Fetch crops with their highest bid
    const cropsWithHighestBids = await Bidder.aggregate([
      {
        $group: {
          _id: "$cropId", // Group by crop ID
          highestBid: { $max: "$bidAmount" }
        }
      },
      {
        $lookup: {
          from: "crops",
          localField: "_id",
          foreignField: "_id",
          as: "cropDetails"
        }
      },
      {
        $unwind: "$cropDetails"
      },
      {
        $project: {
          cropName: "$cropDetails.name",
          highestBid: 1
        }
      }
    ]);

    res.status(200).json({
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalCrops,
      totalBids,
      totalSoldCrops,
      cropsWithHighestBids
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteAuctionItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

exports.getAllPaymentProofs = catchAsyncErrors(async (req, res, next) => {
  let paymentProofs = await PaymentProof.find();
  res.status(200).json({
    success: true,
    paymentProofs,
  });
});

exports.getPaymentProofDetail = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const paymentProofDetail = await PaymentProof.findById(id);
    res.status(200).json({
      success: true,
      paymentProofDetail,
    });
  }
);

exports.updateProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }
  let proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  proof = await PaymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "Payment proof amount and status updated.",
    proof,
  });
});

exports.deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  await proof.deleteOne();
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
});

exports.monthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  const payments = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const tranformDataToMonthlyArray = (payments, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });

    return result;
  };

  const totalMonthlyRevenue = tranformDataToMonthlyArray(payments);
  res.status(200).json({
    success: true,
    totalMonthlyRevenue,
  });
});