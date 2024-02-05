const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require('nodemailer');

const app = express();
const port = 8001;

const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const carsRouter = require("./routes/cars");
const protectedRouter = require("./routes/protected");
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
app.use("/protected", protectedRouter);
app.use("/create-checkout-session", paymentRouter);
app.use("/success", successRouter);
app.use("/watchlist", watchlistRouter)
app.use("/bids", bidsRouter);
app.use("/shipping", shippingRouter);

app.get("/email", (req, res) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'harmony.hermiston76@ethereal.email',
        pass: '2aqr1MZybsQSrmpfY8'
    }
});

  const mailOptions = {
    from: 'harmony.hermiston76@ethereal.email',
    to: 'affanfaisal442@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from Node.js using Nodemailer.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

