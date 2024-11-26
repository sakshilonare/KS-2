const cron = require('node-cron');
const Auction = require('../models/auctionModel.js');
const Bid = require('../models/bidModel.js');
const Farmer = require('../models/farmerModel');
const Buyer = require('../models/buyerModel.js');
const { sendEmail } = require("../utils/sendEmail.js");
const { calculateCommission } = require("../controller/commissionController.js");

exports.endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("Cron for ended auction running...");

    // Find auctions that have ended and have not yet had commissions calculated
    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      commissionCalculated: false,
    });

    for (const auction of endedAuctions) {
      try {
        console.log(`Processing ended auction ID: ${auction._id}`);

        // Calculate commission
        const commissionAmount = await calculateCommission(auction._id);
        auction.commissionCalculated = true;

        // Fetch the highest bid for the auction
        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });

        // Fetch farmer details (auction creator)
        const farmer = await Farmer.findById(auction.createdBy);

        if (highestBidder) {
          auction.highestBidder = highestBidder.bidder.id; // Set highest bidder on auction
          await auction.save();

          // Fetch buyer details (highest bidder)
          const buyer = await Buyer.findById(highestBidder.bidder.id);

          // Update buyer details
          await Buyer.findByIdAndUpdate(
            buyer._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionsWon: 1,
              },
            },
            { new: true }
          );

          // Update farmer's unpaid commission
          await Farmer.findByIdAndUpdate(
            farmer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true }
          );

          // Send email to the highest bidder (buyer)
          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `
            Dear ${buyer.name}, 
            
            Congratulations! You have won the auction for ${auction.title}. 

            Please contact the auctioneer via their email: ${farmer.email} to proceed with the payment. 

            Payment Methods:
            1. **Cash on Delivery (COD)**:
               - You must pay 20% upfront before delivery via any method above.
               - Remaining 80% will be paid upon delivery.

            2. **Payment UPI/credit**:
            For item inspection, contact: ${farmer.email}.
            
            Please complete the payment by the specified due date. Once the payment is confirmed, the item will be shipped to you.

            Best regards,
            Auction Team
          `;

          console.log("SENDING EMAIL TO HIGHEST BIDDER");
          sendEmail({ email: buyer.email, subject, message });
          console.log("SUCCESSFULLY SENT EMAIL TO HIGHEST BIDDER");
        } else {
          // If there is no highest bidder, save the auction with updated details
          await auction.save();
        }
      } catch (error) {
        console.error(`Error in ended auction cron for auction ID ${auction._id}:`, error.message);
      }
    }
  });
};

  
