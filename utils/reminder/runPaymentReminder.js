const Bid = require("./../../models/Bid");
const sendPaymentReminderMail = require("./../../utils/mails/purchase/sendPaymentReminderMail");

const runPaymentReminder = async () => {
  const bids = await Bid.find({ result: true, paid: false });

  for (const bid of bids) {
    if (bid.daysLeft > 1) {
      const { email, vehicle, daysLeft } = bid;
      sendPaymentReminderMail(email, vehicle, daysLeft);
      bid.daysLeft -= 1;
    } else {
      const fine = Math.max(50, 0.02 * bid.totalCost);
      bid.totalCost += fine;
    }
    await bid.save();
  }
};

module.exports = runPaymentReminder;
