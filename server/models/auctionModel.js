const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  category: {
    type: String,
    enum: ["Fruit", "Vegetable", "Pulse"],
  },
  currentBid: { type: Number, default: 0 },
  startTime: String,
  endTime: String,
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
      name: { type: String },
      amount: Number,
    },
  ],
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
  },
  // status: {
  //   type: String,
  //   enum: ['active', 'ended', 'not started yet'], // Add 'not started yet' to the enum values
  //   default: 'not started yet', // Default value if status is not set
  // },
  commissionCalculated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// auctionSchema.pre('save', async function (next) {
//   if (this.isNew || this.isModified('startTime') || this.isModified('endTime')) {
//     const now = Date.now();
//     if (this.startTime <= now && this.endTime > now) {
//       this.status = 'active';
//     } else if (this.endTime < now) {
//       this.status = 'ended';
//     } else {
//       this.status = 'not started yet';
//     }
//   }
//   next();
// });

const Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction