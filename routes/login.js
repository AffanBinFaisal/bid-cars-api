const express = require("express");
const router = express.Router();
const UserController = require("./../controllers/UserController");

router.post('/', UserController.loginUser);

module.exports = router;
