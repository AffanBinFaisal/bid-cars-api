// Importing necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');
const path = require("path");
require('dotenv').config();

// Importing a utility function for payment reminders
const runPaymentReminder = require("./utils/reminder/runPaymentReminder");

// Importing routers for different features
const authRouter = require("./routes/auth/authRouter");
const carsRouter = require("./routes/cars/carsRouter");
const watchlistRouter = require("./routes/watchlist/watchlistRouter");
const bidsRouter = require("./routes/bids/bidsRouter");
const shippingRouter = require("./routes/shipping/shippingRouter");
const paymentsRouter = require("./routes/payments/paymentsRouter");
// const purchaseRouter = require("./routes/purchase/purchaseRouter");
const imageRouter = require("./routes/image/imageRouter");
const calculcationsRouter = require("./routes/calculations/calculationsRouter");

// Creating an Express app
const app = express();
const port = process.env.PORT;

// Enabling CORS and parsing incoming JSON requests
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serving images from the 'uploads' directory under '/images' route
app.use("/images", express.static(path.join(__dirname, 'uploads')));

// Configuring routes for different features
app.use("/auth", authRouter);
app.use("/cars", carsRouter);
app.use("/payments", paymentsRouter);
app.use("/watchlist", watchlistRouter);
app.use("/bids", bidsRouter);
app.use("/shippings", shippingRouter);
// app.use("/purchase", purchaseRouter);
app.use("/images", imageRouter);
app.use("/calculations", calculcationsRouter);

// Scheduling a cron job for payment reminders
const job = cron.schedule('0 0 * * 1-5', runPaymentReminder);

// Starting the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
