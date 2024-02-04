const mongoose = require("./db/db");

const watchlistSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
  },
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
