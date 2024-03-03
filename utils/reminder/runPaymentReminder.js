// Importing the Bid model for database operations
const Bid = require("./../../models/Bid");

// Importing the function to send payment reminder emails
const sendPaymentReminderMail = require("./../../utils/mails/purchase/sendPaymentReminderMail");

// Function to run payment reminders for unpaid, successful bids
const runPaymentReminder = async () => {
  // Fetching all bids that are successful but not yet paid
  const bids = await Bid.find({ result: true, paid: false });

  // Iterating over each bid
  for (const bid of bids) {
    // Checking if there are more than 1 day left for payment
    if (bid.daysLeft > 1) {
      // Extracting necessary information from the bid
      const { email, vehicle, daysLeft } = bid;

      // Sending a payment reminder email
      sendPaymentReminderMail(email, vehicle, daysLeft);

      // Decreasing the daysLeft for payment
      bid.daysLeft -= 1;
    } else {
      // If only 1 day left or overdue, applying a fine to the total cost
      const fine = Math.max(50, 0.02 * bid.totalCost);
      bid.totalCost += fine;
    }

    // Saving the bid with updated information
    await bid.save();
  }
};

// Exporting the function for use in other parts of the application
module.exports = runPaymentReminder;
