// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Function to send a bid notification email to the admin
const sendBidMail = (email, vehicle) => {

  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER,
    to: process.env.RECIPIENT,
    subject: 'New Bid Notification from Bid-Cars',
    html: `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; margin: 20px;">
            <h2 style="color: #3498db;">Bid-Cars New Bid Notification</h2>
            <p>Hello Admin,</p>
            <p>${email} has submitted a new bid for the vehicle ${vehicle}.</p>
            <p>Details:</p>
            <ul>
              <li><strong>Client:</strong> ${email}</li>
              <li><strong>Vehicle:</strong> ${vehicle}</li>
            </ul>
            <p>Please log in to the Bid-Cars platform to review and manage the bids.</p>
            <p>Thank you,</p>
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
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Exporting the function for use in other parts of the application
module.exports = sendBidMail;
