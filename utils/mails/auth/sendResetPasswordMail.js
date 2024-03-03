// Loading environment variables from a .env file
require("dotenv").config();

// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Extracting necessary environment variables
const websiteUrl = process.env.WEBSITE_URL;

// Function to send a password reset email
const resetPasswordMail = async (recipient, verificationToken) => {
  // Creating the password reset link using the verification token
  const resetPasswordLink = `${websiteUrl}/reset-password/${verificationToken}`;

  // Configuring the email options
  const mailOptions = {
    from: process.env.USER,
    to: recipient,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetPasswordLink}`,
  };

  // Sending the email using the configured transporter
  transporter.sendMail(mailOptions, (error, info) => {
    // Logging any errors or the success response
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Exporting the function for use in other parts of the application
module.exports = resetPasswordMail;
