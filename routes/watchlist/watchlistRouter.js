// Importing necessary modules
const express = require("express");

// Creating an Express router
const router = express.Router();

// Importing middleware function for authentication
const authenticateToken = require("../../middlewares/authenticateToken");

// Importing the Watchlist model
const Watchlist = require("../../models/Watchlist");

// Route to get user's watchlist, requiring authentication
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Extracting the email from the authenticated user
    const { email } = req.user;

    // Fetching the watchlist for the user
    const watchlist = await Watchlist.find({ email: email });

    // Sending the watchlist as a JSON response
    res.status(200).json({ watchlist });
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a vehicle to the user's watchlist, requiring authentication
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Extracting the email from the authenticated user and the vehicle from the request body
    const { email } = req.user;
    const { vehicle } = req.body;

    // Creating a new Watchlist entry
    const watchlist = new Watchlist({
      email: email,
      vehicle: vehicle,
    });

    // Saving the watchlist entry to the database
    await watchlist.save();

    // Sending a 200 OK response
    res.status(200).end();
  } catch (error) {
    // Handling errors and sending a 500 Internal Server Error response
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Exporting the router for use in other parts of the application
module.exports = router;
