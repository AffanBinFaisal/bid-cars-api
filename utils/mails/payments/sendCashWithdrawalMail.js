// Importing the email transporter for sending emails
const transporter = require("../transporter/transporter");

// Function to send a cash withdrawal confirmation email
const sendCashWithdrawalMail = (email, amount) => {

  // Configuring the email options with HTML content
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Cash Withdrawal Notification from Bid-Cars',
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px;">
          <h2 style="color: #721c24;">Bid-Cars Withdrawal Confirmation</h2>
          <p>Hello ${email},</p>
          <p>We are confirming the successful withdrawal of an amount from your account.</p>
          <p><strong>Withdrawal Details:</strong></p>
          <ul>
            <li><strong>Client:</strong> ${email}</li>
            <li><strong>Amount Withdrawn:</strong> $${amount}</li>
          </ul>
          <p>Your account balance has been updated accordingly.</p>
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
module.exports = sendCashWithdrawalMail;
