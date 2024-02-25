const nodemailer = require("nodemailer");
const transporter = require("../transporter/transporter");

const sendPurchaseMail = (email, vehicle) => {

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Car Purchase Notification from Bid-Cars',
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendPurchaseMail;