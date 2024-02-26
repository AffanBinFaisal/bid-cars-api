// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Function to send a payment reminder email
const sendPaymentReminderMail = (email, vehicle, daysLeft) => {
  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER, // Sender email
    to: email, // Recipient email
    subject: 'Payment Reminder from Bid-Cars', // Email subject
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px;">
          <h2 style="color: #721c24;">Bid-Cars Purchase Reminder</h2>
          <p>Hello ${email},</p>
          <p>This is a friendly reminder that you have ${daysLeft} days left to complete your purchase for the vehicle.</p>
          <p><strong>Pending Details:</strong></p>
          <ul>
            <li><strong>Client:</strong> ${email}</li>
            <li><strong>Vehicle Pending:</strong> ${vehicle}</li>
          </ul>
          <p>Please log in to your Bid-Cars account to complete the purchase as soon as possible.</p>
          <p style="color: #888; font-size: 12px;">This is an automated reminder. Please do not reply to this email.</p>
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
module.exports = sendPaymentReminderMail;
