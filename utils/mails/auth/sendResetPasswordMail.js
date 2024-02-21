const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = require("../transporter/transporter");

const serverUrl = process.env.SERVER_URL;

const resetPasswordMail = async (recipient, verificationToken) => {
  const resetPasswordLink = `http://localhost:3000/reset-password/${verificationToken}`;

  const mailOptions = {
    from: process.env.USER,
    to: recipient,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetPasswordLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = resetPasswordMail;
