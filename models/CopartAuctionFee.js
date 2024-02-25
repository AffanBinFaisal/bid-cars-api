const mongoose = require("../mongoose/mongoose");

const copartAuctionFeeSchema = new mongoose.Schema({
  sellPrice: {
    type: String,
  },
  minPrice: {
    type: Number,
  },
  maxPrice: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

const CopartAuctionFee = mongoose.model('CopartAuctionFee', copartAuctionFeeSchema, "copart_auction_fee");

module.exports = CopartAuctionFee;