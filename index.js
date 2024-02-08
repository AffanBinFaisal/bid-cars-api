const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');
const runPaymentReminder = require("./utils/reminder/runPaymentReminder");

require('dotenv').config();

const authRouter = require("./routes/auth/authRouter");
const carsRouter = require("./routes/cars/carsRouter");
const watchlistRouter = require("./routes/watchlist/watchlistRouter");
const bidsRouter = require("./routes/bids/bidsRouter");
const shippingRouter = require("./routes/shipping/shippingRouter");
const paymentsRouter = require("./routes/payments/paymentsRouter");
const purchaseRouter = require("./routes/purchase/purchaseRouter");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/cars", carsRouter);
app.use("/payments", paymentsRouter);
app.use("/watchlist", watchlistRouter);
app.use("/bids", bidsRouter);
app.use("/shipping", shippingRouter);
app.use("/purchase", purchaseRouter);

const job = cron.schedule('0 0 * * 1-5', runPaymentReminder);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

