// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Function to send a bid confirmation email
const sendBidConfirmationMail = (email, vehicle) => {

  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'New Bid Notification from Bid-Cars',
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
          <h2 style="color: #3498db;">Bid-Cars New Bid Notification</h2>
          <p>Hello ${email},</p>
          <p>We're excited to inform you that you've successfully placed a bid for the vehicle ${vehicle} on Bid-Cars.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Client:</strong> ${email}</li>
            <li><strong>Vehicle:</strong> ${vehicle}</li>
          </ul>
          <p>You can log in to the Bid-Cars platform to review and manage your bids.</p>
          <p>Thank you for choosing Bid-Cars!</p>
          <p style="color: #888; font-size: 12px;">This is an automated notification. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  
    `,
  };

  // Sending the email using the configured transporter
  transporter.sendMail(mailOptions, (error, info) => {
    // Logging any errors or the success response
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Exporting the function for use in other parts of the application
module.exports = sendBidConfirmationMail;
