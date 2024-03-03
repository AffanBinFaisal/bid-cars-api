// Loading environment variables from a .env file
require("dotenv").config();

// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Extracting necessary environment variables
const websiteUrl = process.env.WEBSITE_URL;

// Function to send a verification email
const sendVerificationMail = (recipient, verificationToken) => {
  // Creating the verification link using the verification token
  const verificationLink = `${websiteUrl}/verified/${verificationToken}`;

  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER,
    to: recipient,
    subject: "Welcome to Bid-Cars - Verify Your Email",
    html: `
      <html>
        <body style="font-family: 'Arial', sans-serif; margin: 20px; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #3498db; text-align: center;">Welcome to Bid-Cars!</h2>
            <p>Hello ${recipient},</p>
            <p>Thank you for registering with Bid-Cars. To complete your registration and start bidding, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
            </div>
            <p>If the button above doesn't work, you can also click on the following link:</p>
            <p>${verificationLink}</p>
            <p>Thank you for choosing Bid-Cars. We look forward to having you as part of our community!</p>
            <p>Best Regards,</p>
            <p>The Bid-Cars Team</p>
          </div>
        </body>
      </html>
    `,
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
module.exports = sendVerificationMail;