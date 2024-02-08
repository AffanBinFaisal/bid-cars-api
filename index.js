const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8001;

// Routes
const loginRouter = require("./routes/auth/login");
const registerRouter = require("./routes/auth/register");
const verificationRouter = require("./routes/auth/verify");
const carsRouter = require("./routes/cars/cars");
const depositRouter = require("./routes/payments/deposit");
const successRouter = require("./routes/success");
const watchlistRouter = require("./routes/watchlist");
const bidsRouter = require("./routes/bids");
const shippingRouter = require("./routes/shipping");
const refundRouter = require("./routes/payments/refund");
const forgotPasswordRouter = require("./routes/auth/forgotPassword");
const resetPasswordRouter = require("./routes/auth/resetPassword");
const transactionsRouter = require("./routes/transactions");

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// Authentication
app.use("/auth", registerRouter);
app.use("/auth", loginRouter);
app.use("/auth", verificationRouter);
app.use("/auth", forgotPasswordRouter);
app.use("/auth", resetPasswordRouter);

// Cars
app.use("/cars", carsRouter);

// Payments
app.use("/payments", transactionsRouter);
app.use("/payments", depositRouter);
app.use("/payments", refundRouter);
app.use("/payments", successRouter);

// Watchlist
app.use("/watchlist", watchlistRouter);

// Bids
app.use("/bids", bidsRouter);

// Shipping
app.use("/shipping", shippingRouter);


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

