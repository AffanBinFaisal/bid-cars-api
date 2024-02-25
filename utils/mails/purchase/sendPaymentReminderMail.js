const nodemailer = require("nodemailer");
const transporter = require("../transporter/transporter");

const sendPaymentReminderMail = (email, vehicle, daysLeft) => {

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Payment Reminder from Bid-Cars',
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendPaymentReminderMail;