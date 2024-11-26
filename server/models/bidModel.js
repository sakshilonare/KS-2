const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  amount: Number,
  bidder: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
    },
    name: { type: String },
    amount: Number,
  },
  auctionItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;