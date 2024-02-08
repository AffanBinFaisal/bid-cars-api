const express = require("express");
require('dotenv').config();

const router = express.Router();

const authenticateToken = require("../../middlewares/authenticate");
const PaymentController = require("../../controllers/PaymentController")


router.post('/', authenticateToken, PaymentController.getSessionUrl);

module.exports = router;
