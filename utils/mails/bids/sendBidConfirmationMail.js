const nodemailer = require("nodemailer");
const transporter = require("../transporter/transporter");

const sendBidConfirmationMail = (email, vehicle) => {

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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendBidConfirmationMail;