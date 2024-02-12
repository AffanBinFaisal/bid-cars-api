const jwt = require("jsonwebtoken");
const secretKey = 'your-secret-key';

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is missing' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;