// Importing Nodemailer
const nodemailer = require('nodemailer');

// Loading environment variables from a .env file
require('dotenv').config();

// Creating a Nodemailer transporter with Gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER, // Gmail username (email address)
    pass: process.env.PASS, // Gmail password or an application-specific password
  },
});

// Exporting the transporter for use in other parts of the application
module.exports = transporter;
