const jwt = require("jsonwebtoken");
const secretKey = 'your-secret-key'; // Replace 'your-secret-key' with your actual secret key

// Middleware function to allow only admin users
const adminOnly = (req, res, next) => {
  const token = req.headers['authorization'];

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // If verification fails, return Forbidden
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    // Check if the user has admin privileges based on email
    if (user.email === "affanfaisal442@gmail.com") {
      // If the user is an admin, attach user information to the request and proceed to the next middleware
      req.user = user;
      next();
    } else {
      // If the user is not an admin, return Forbidden
      return res.status(403).json({ error: "Forbidden: Insufficient privileges" });
    }
  });
}

module.exports = adminOnly;
