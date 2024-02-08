const mongoose = require('mongoose');

//mongodb+srv://bidcars:<password>@bid-cars.c3tcxer.mongodb.net/?retryWrites=true&w=majority

const username = 'bidcars';
const password = 'bidcars';
const host = 'bid-cars.c3tcxer.mongodb.net';

const connectionString = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority`;

// Connect to the MongoDB database
mongoose.connect(connectionString);

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
