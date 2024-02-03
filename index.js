const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8001;

const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const carsRouter = require("./routes/cars");
const protectedRouter = require("./routes/protected");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/cars", carsRouter);
app.use("/protected", protectedRouter);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

