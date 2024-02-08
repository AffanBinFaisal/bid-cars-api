const mongoose = require("./mongoose/mongoose");

const watchlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
  },
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
