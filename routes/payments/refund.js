const express = require("express");
const router = express.Router();

const authenticateToken = "./../middlewares/authenticateToken";
const verifyUser = "./../middlewares/verifyUser";
const withdrawAmount = "./../controllers/paymentController";

router.post('/', authenticateToken, verifyUser, withdrawAmount);

module.exports = router;
