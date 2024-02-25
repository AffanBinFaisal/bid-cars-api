const mongoose = require("../mongoose/mongoose");

const iaaiAuctionFeeSchema = new mongoose.Schema({
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

const IaaiAuctionFee = mongoose.model('IaaiAuctionFee', iaaiAuctionFeeSchema, "iaai_auction_fee");

module.exports = IaaiAuctionFee;