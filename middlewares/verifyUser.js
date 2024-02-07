const express = require("express");

const User = require("../models/User");

const verifyUser = async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({email:email});
  if(!user.verified){
    res.status(401).json({error: "User is not verified"});
  }
  next();
};

module.exports = verifyUser;