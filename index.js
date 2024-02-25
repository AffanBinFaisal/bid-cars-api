const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require('node-cron');
const path = require("path");
require('dotenv').config();

const runPaymentReminder = require("./utils/reminder/runPaymentReminder");

const authRouter = require("./routes/auth/authRouter");
const carsRouter = require("./routes/cars/carsRouter");
const watchlistRouter = require("./routes/watchlist/watchlistRouter");
const bidsRouter = require("./routes/bids/bidsRouter");
const shippingRouter = require("./routes/shipping/shippingRouter");
const paymentsRouter = require("./routes/payments/paymentsRouter");
const purchaseRouter = require("./routes/purchase/purchaseRouter");
const imageRouter = require("./routes/image/imageRouter");
const calculcationsRouter = require("./routes/calculations/calculationsRouter");

const app = express();
const port = process.env.PORT;
// const host = process.env.HOST;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, 'uploads')));

app.use("/auth", authRouter);
app.use("/cars", carsRouter);
app.use("/payments", paymentsRouter);
app.use("/watchlist", watchlistRouter);
app.use("/bids", bidsRouter);
app.use("/shippings", shippingRouter);
app.use("/purchase", purchaseRouter);
app.use("/images", imageRouter);
app.use("/calculations", calculcationsRouter);

const job = cron.schedule('0 0 * * 1-5', runPaymentReminder);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

