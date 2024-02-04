const jwt = require("jsonwebtoken");
const express = require("express");
const secretKey = 'your-secret-key';

const addUser = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      }
    });
  } else {
    next();
  };
  next();
}

module.exports = addUser;