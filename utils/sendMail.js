const nodemailer = require('nodemailer');

const sendMail = (username, vehicle) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    }
  });

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
            <p>${username} has submitted a new bid for the vehicle ${vehicle}.</p>
            <p>Details:</p>
            <ul>
              <li><strong>Client:</strong> ${username}</li>
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendMail;