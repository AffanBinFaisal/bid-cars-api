const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key"; // Replace 'your-secret-key' with your actual secret key

// Middleware function to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]; // Extract the token from the 'Authorization' header
  console.log(req.headers); // Log the headers for debugging (optional)

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // If verification fails, return Forbidden
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    // If the token is valid, attach user information to the request and proceed to the next middleware
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
