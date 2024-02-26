const TransportFee = require("./../models/TransportFee");
const IaaiAuctionFee = require("../models/IaaiAuctionFee");
const CopartAuctionFee = require("../models/CopartAuctionFee");
const BidFee = require("../models/BidFee");

require("dotenv").config();
const axios = require("axios");

const apiToken = process.env.API_TOKEN;

const getDestinations = async (req, res) => {
  const { type } = req.query;
  const destinations = await TransportFee.find({ type: type });
  res.status(200).json({ destinations });
};

const calculateCost = async (req, res) => {
  const { type, price, destination, terminal, auctionName } = req.query;
  console.log(req.query);
  var serviceFee = 0;
  var environmentalFee = 0;
  var premiumVehicleReport = 0;
  var gateFee = 0;
  var auctionFee = 0;
  var destinationFee = 0;
  var transportFee = 0;
  var internetBidFee = 0;
  var proxyBidFee = 0;
  var liveBidFee = 0;
  var total = 0;

  if (type == "iaai") {
    if (price >= 15000) {
      auctionFee = (price * 6) / 100;
    }
    else {
      const iaaiAuctionFee = await IaaiAuctionFee.findOne({
        $and: [
          { minPrice: { $lte: price } },
          { maxPrice: { $gte: price } }
        ]
      });
      auctionFee = iaaiAuctionFee.price;
    }

  } else if (type == "copart") {
    if (price >= 15000) {
      auctionFee = (price * 6) / 100;
    }
    else {
      const copartAuctionFee = await CopartAuctionFee.findOne({
        $and: [
          { minPrice: { $lte: price } },
          { maxPrice: { $gte: price } }
        ]
      });
      auctionFee = copartAuctionFee.price;
    }
  }

  if (destination == "klaipeda") {

    if (terminal == "savannah") {
      destinationFee = 725;
    }
    else if (terminal == "nj") {
      destinationFee = 700;
    }
    else if (terminal == "houston") {
      destinationFee = 850;
    }
    else if (terminal == "miami") {
      destinationFee = 750;
    }
    else {
      destinationFee = 850;
    }
  }
  else {
    if (terminal == "savannah") {
      destinationFee = 675;
    }
    else if (terminal == "nj") {
      destinationFee = 675;
    }
    else if (terminal == "houston") {
      destinationFee = 800;
    }
    else if (terminal == "miami") {
      destinationFee = 750;
    }
    else {
      destinationFee = 800;
    }
  }

  const transport = await TransportFee.findOne({
    //type: type,
    name: auctionName,
  });

  if (transport[terminal]) {
    transportFee = transport[terminal].replace(/\s/g, "");
    transportFee = transport[terminal].replace(",", "");
  } else {
    transportFee = 0
  }

  if (type == "iaai") {

    if (price >= 8000) {
      internetBidFee = 129;
      proxyBidFee = 149;
    }
    else {
      const bidFee = await BidFee.findOne({
        maxPrice: { $gt: auctionFee },
        minPrice: { $lt: auctionFee }
      });
      internetBidFee = bidFee.internetBidFee;
      proxyBidFee = bidFee.proxyBidFee;
    }

    serviceFee = 250;
    environmentalFee = 10;
    premiumVehicleReport = 15;

    total = parseInt(price) + serviceFee + environmentalFee + premiumVehicleReport + transportFee + internetBidFee + proxyBidFee + destinationFee;

  }
  else if (type == "copart") {

    if (price >= 8000) {
      liveBidFee = 149;
    }
    else {
      const bidFee = await BidFee.findOne({
        $and: [
          { minPrice: { $lte: price } },
          { maxPrice: { $gte: price } }
        ]
      });

      if (bidFee.liveBidFee == "FREE") {
        liveBidFee = 0;
      }
      else {
        liveBidFee = bidFee.liveBidFee;
      }
    }
    serviceFee = 250;
    gateFee = 79;
    total = parseInt(price) + gateFee + environmentalFee + serviceFee + transportFee + liveBidFee + destinationFee;
  }

  res.status(200).json({ price, gateFee, environmentalFee, serviceFee, transportFee, liveBidFee, destinationFee, transportFee, internetBidFee, proxyBidFee, liveBidFee, total });
}

const calculateTotal = async (req, res) => {
  const { price, vin, destination } = req.query;

  const apiUrl = "https://copart-iaai-api.com/api/v1/get-car-vin";
  const carResponse = await axios.post(apiUrl, {
    api_token: apiToken,
    vin_number: vin,
  });
  const car = carResponse.data.result[0];
  const type = car.auction_name.toLowerCase();
  const auctionName = car.location;

  var serviceFee = 0;
  var environmentalFee = 0;
  var premiumVehicleReport = 0;
  var gateFee = 0;
  var auctionFee = 0;
  var destinationFee = 0;
  var transportFee = 0;
  var internetBidFee = 0;
  var proxyBidFee = 0;
  var liveBidFee = 0;
  var total = 0;

  if (type == "iaai") {
    if (price >= 15000) {
      auctionFee = (price * 6) / 100;
    }
    else {
      const iaaiAuctionFee = await IaaiAuctionFee.findOne({
        $and: [
          { minPrice: { $lte: price } },
          { maxPrice: { $gte: price } }
        ]
      });
      auctionFee = iaaiAuctionFee.price;
    }

  } else if (type == "copart") {
    if (price >= 15000) {
      auctionFee = (price * 6) / 100;
    }
    else {
      const copartAuctionFee = await CopartAuctionFee.findOne({
        $and: [
          { minPrice: { $lte: price } },
          { maxPrice: { $gte: price } }
        ]
      });
      auctionFee = copartAuctionFee.price;
    }
  }


  const fields = auctionName.split(" - ");
  const field2 = fields[0];
  const field1 = fields[1];
  var minKey;
  var minValue = 9999999;

  const transport = await TransportFee.findOne({
    field2: field2,
    field1: field1,
  });

  const destinations = ["savannah", "nj", "houston", "miami", "chicago"];
  for (const destination of destinations) {
    if (transport[destination] === null) {
      transport[destination] = 0;
    }
    if (minValue > transport[destination]) {
      minValue = transport[destination];
      minKey = destination;
    }
  }


  const terminal = minKey;
  console.log(terminal);

  if (destination == "klaipeda") {

    if (terminal == "savannah") {
      destinationFee = 725;
    }
    else if (terminal == "nj") {
      destinationFee = 700;
    }
    else if (terminal == "houston") {
      destinationFee = 850;
    }
    else if (terminal == "miami") {
      destinationFee = 750;
    }
    else {
      destinationFee = 850;
    }
  }
  else {
    if (terminal == "savannah") {
      destinationFee = 675;
    }
    else if (terminal == "nj") {
      destinationFee = 675;
    }
    else if (terminal == "houston") {
      destinationFee = 800;
    }
    else if (terminal == "miami") {
      destinationFee = 750;
    }
    else {
      destinationFee = 800;
    }
  }

  if (transport[terminal]) {
    if (typeof (transport[terminal]) == "String") {
      transportFee = transport[terminal].replace(/\s/g, "");
      transportFee = transport[terminal].replace(",", "");
    }

  } else {
    transportFee = 0
  }

  if (type == "iaai") {

    if (price >= 8000) {
      internetBidFee = 129;
      proxyBidFee = 149;
    }
    else {
      const bidFee = await BidFee.findOne({
        maxPrice: { $gt: auctionFee },
        minPrice: { $lt: auctionFee }
      });
      internetBidFee = bidFee.internetBidFee;
      proxyBidFee = bidFee.proxyBidFee;
    }

    serviceFee = 250;
    environmentalFee = 10;
    premiumVehicleReport = 15;

    total = parseInt(price) + serviceFee + environmentalFee + premiumVehicleReport + transportFee + internetBidFee + proxyBidFee + destinationFee;

  } else if (type == "copart") {

    if (price >= 8000) {
      liveBidFee = 149;
    }
    else {
      const bidFee = await BidFee.findOne({
        $and: [
          { minPrice: { $lte: price } },
          { maxPrice: { $gte: price } }
        ]
      });

      if (bidFee.liveBidFee == "FREE") {
        liveBidFee = 0;
      }
      else {
        liveBidFee = bidFee.liveBidFee;
      }
    }
    serviceFee = 250;
    gateFee = 79;
    total = parseInt(price) + gateFee + environmentalFee + serviceFee + transportFee + liveBidFee + destinationFee;
  }

  res.status(200).json({ price, gateFee, environmentalFee, serviceFee, transportFee, liveBidFee, destinationFee, transportFee, internetBidFee, proxyBidFee, liveBidFee, total });

}

module.exports = {
  getDestinations,
  calculateCost,
  calculateTotal,
}