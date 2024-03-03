const jwt = require("jsonwebtoken");
const secretKey = 'your-secret-key'; // Replace 'your-secret-key' with your actual secret key

// Middleware function to add user information to the request
const addUserInfo = (req, res, next) => {
  const token = req.headers['authorization']; // Extract the token from the Authorization header

  if (token) {
    // If a token is present, verify it using the secret key
    jwt.verify(token, secretKey, (err, user) => {
      if (!err) {
        // If verification is successful, attach the user information to the request object
        req.user = user;
      }
    });
  }

  // Move to the next middleware or route handler
  next();
}

module.exports = addUserInfo;
