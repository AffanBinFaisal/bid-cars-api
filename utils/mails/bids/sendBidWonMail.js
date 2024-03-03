// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Function to send a bid result notification email (when bid is won)
const sendBidWonMail = (email, vehicle, remainingAmount) => {

  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'New Bid Notification from Bid-Cars',
    html: `
    <html>
    <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
      <div style="background-color: #d4edda; padding: 20px; border-radius: 10px;">
        <h2 style="color: #28a745;">Bid-Cars Bid Result Notification</h2>
        <p>Hello ${email},</p>
        <p>Congratulations! You have won the bid for the vehicle ${vehicle} on Bid-Cars.</p>
        <p><strong>Bid Details:</strong></p>
        <ul>
          <li><strong>Client:</strong> ${email}</li>
          <li><strong>Vehicle:</strong> ${vehicle}</li>
        </ul>
        <p>Please proceed to pay the remaining amount as soon as possible to secure your purchase.</p>
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
module.exports = sendBidWonMail;
