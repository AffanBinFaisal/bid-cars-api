const mongoose = require('mongoose');

// MongoDB connection details
const username = 'bidcars';
const password = 'bidcars';
const host = 'bid-cars.c3tcxer.mongodb.net';

// Constructing the MongoDB connection string
const connectionString = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`;

// Connect to the MongoDB database
mongoose.connect(connectionString);

// Access the default connection
const db = mongoose.connection;

// Event listeners for successful and failed connections
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Optionally, export the `mongoose` object for use in other parts of your application
module.exports = mongoose;
