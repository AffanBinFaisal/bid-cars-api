// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Function to send a purchase confirmation email
const sendPurchaseMail = (email, vehicle) => {
  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER, // Sender email
    to: email, // Recipient email
    subject: 'Car Purchase Notification from Bid-Cars', // Email subject
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
        <div style="background-color: #d4edda; padding: 20px; border-radius: 10px;">
          <h2 style="color: #155724;">Bid-Cars Purchase Confirmation</h2>
          <p>Hello ${email},</p>
          <p>Congratulations! We are delighted to inform you that you have successfully purchased the vehicle.</p>
          <p><strong>Purchase Details:</strong></p>
          <ul>
            <li><strong>Client:</strong> ${email}</li>
            <li><strong>Vehicle Purchased:</strong> ${vehicle}</li>
          </ul>
          <p>Thank you for choosing Bid-Cars. We hope you enjoy your new vehicle!</p>
          <p style="color: #888; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
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
module.exports = sendPurchaseMail;
