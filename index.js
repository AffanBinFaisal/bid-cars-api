const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8001;

const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const carsRouter = require("./routes/cars");
const paymentRouter = require("./routes/payment");
const successRouter = require("./routes/success");
const watchlistRouter = require("./routes/watchlist");
const bidsRouter = require("./routes/bids");
const shippingRouter = require("./routes/shipping");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/cars", carsRouter);
app.use("/create-checkout-session", paymentRouter);
app.use("/success", successRouter);
app.use("/watchlist", watchlistRouter)
app.use("/bids", bidsRouter);
app.use("/shipping", shippingRouter);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

