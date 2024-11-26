const Auction = require('../models/auctionModel.js');
const Bid = require('../models/bidModel.js');
const Buyer = require('../models/buyerModel.js');
const { catchAsyncErrors } =require('../middleware/catchAsyncErrors.js');
const {ErrorHandler}=require('../middleware/error.js');

exports.placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found.", 404));
  }

  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 404));
  }

  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than the current bid.", 404)
    );
  }

  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than starting bid.", 404)
    );
  }

  try {
    // Fetch buyer details
    console.log("User ID from token:", req.user.id);
    const bidderDetail = await Buyer.findById(req.user.id);
    if (!bidderDetail) {
      return next(new ErrorHandler("Bidder details not found.", 404));
    }
    console.log("Bidder details fetched:", bidderDetail);

    // Check for existing bid
    const existingBid = await Bid.findOne({
      "bidder.id": req.user.id,
      auctionItem: auctionItem._id,
    });

    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() === req.user.id.toString()
    );

    if (existingBid && existingBidInAuction) {
      console.log("Updating existing bid...");
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save();
      await existingBid.save();
      auctionItem.currentBid = amount;
    } else {
      console.log("Creating new bid...");
      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          name: bidderDetail.name, // Add bidder's name here
          amount,
        },
        auctionItem: auctionItem._id,
      });

      auctionItem.bids.push({
        userId: req.user.id,
        name: bidderDetail.name, // Add bidder's name here
        amount,
      });

      auctionItem.currentBid = amount;
    }

    await auctionItem.save();

    res.status(201).json({
      success: true,
      message: "Bid placed.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    console.error("Error placing bid:", error);
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});
