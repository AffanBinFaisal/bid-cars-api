const nodemailer = require("nodemailer");
const transporter = require("../transporter/transporter");

const sendBidLostMail = (email, vehicle) => {

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'New Bid Notification from Bid-Cars',
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
          <h2 style="color: #e74c3c;">Bid-Cars Bid Result Notification</h2>
          <p>Hello ${email},</p>
          <p>We regret to inform you that you didn't win the bid for the vehicle ${vehicle} on Bid-Cars.</p>
          <p><strong>Bid Details:</strong></p>
          <ul>
            <li><strong>Client:</strong> ${email}</li>
            <li><strong>Vehicle:</strong> ${vehicle}</li>
          </ul>
          <p>Thank you for participating, and we encourage you to explore other opportunities on our platform.</p>
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

module.exports = sendBidLostMail;