// Importing necessary modules
const multer = require("multer");
const path = require("path");

// Configuring multer storage for file uploads
const storage = multer.diskStorage({
  // Setting the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // Setting the filename for uploaded files
  filename: function (req, file, cb) {
    // Creating a unique filename based on the original filename and current timestamp
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// Creating a multer instance with the configured storage
const upload = multer({ storage: storage });

// Exporting the multer instance for use in other parts of the application
module.exports = upload;
