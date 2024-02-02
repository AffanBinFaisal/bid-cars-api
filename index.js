const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;
const secretKey = 'your-secret-key';

app.use(bodyParser.json());

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
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

// Login route to generate and return a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // In a real application, you would validate the username and password against a database
  // For simplicity, we'll assume it's valid for this example

  // Create a token with user information
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Protected route requiring authentication
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}! This is a protected route.` });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
