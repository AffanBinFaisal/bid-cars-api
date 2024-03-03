const User = require("../models/User");

// Middleware function to verify if the user is verified
const verifyUser = async (req, res, next) => {
  const { email } = req.user; // Extract the email from the user information attached to the request

  try {
    // Find the user in the database based on the email
    const user = await User.findOne({ email: email });

    // Check if the user is not verified
    if (!user || !user.verified) {
      return res.status(401).json({ error: "User is not verified" });
    }

    // If the user is verified, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any errors that occur during the verification process
    console.error("Error during user verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = verifyUser;
