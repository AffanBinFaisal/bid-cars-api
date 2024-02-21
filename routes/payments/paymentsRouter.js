const express = require("express");
require("dotenv").config();

const router = express.Router();

const authenticateToken = require("../../middlewares/authenticateToken");
const verifyUser = require("../../middlewares/verifyUser");

const paymentController = require("../../controllers/paymentController");

router.post(
  "/deposit",
  authenticateToken,
  verifyUser,
  paymentController.getSessionUrl
);
router.post(
  "/withdraw",
  authenticateToken,
  verifyUser,
  paymentController.withdrawAmount
);
router.get("/success", paymentController.processPayment);
router.get(
  "/",
  authenticateToken,
  verifyUser,
  paymentController.getTransactions
);

module.exports = router;
