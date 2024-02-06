const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8001;

// Routes
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const verificationRouter = require("./routes/verify");
const carsRouter = require("./routes/cars");
const paymentRouter = require("./routes/payment");
const successRouter = require("./routes/success");
const watchlistRouter = require("./routes/watchlist");
const bidsRouter = require("./routes/bids");
const shippingRouter = require("./routes/shipping");
const refundRouter = require("./routes/refund");
const forgotPasswordRouter = require("./routes/forgotPassword");
const resetPasswordRouter = require("./routes/resetPassword");
const transactionsRouter = require("./routes/transactions");



// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// Authentication
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/verify", verificationRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/reset-password", resetPasswordRouter);

// Cars
app.use("/cars", carsRouter);

// Payments
app.use("/transactions", transactionsRouter);
app.use("/deposit", paymentRouter);
app.use("/refund", refundRouter);
app.use("/success", successRouter);

// Watchlist
app.use("/watchlist", watchlistRouter)

// Bids
app.use("/bids", bidsRouter);

// Shipping
app.use("/shipping", shippingRouter);


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

