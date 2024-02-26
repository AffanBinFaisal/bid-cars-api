// Importing necessary modules
const express = require("express");
const router = express.Router();

// Importing middleware for handling file uploads
const upload = require("./../../utils/upload/upload");

// Importing the image controller
const imageController = require("./../../controllers/imageController");

// Routes for managing images

// Add images to a specific entity identified by ID
router.post('/add/:id', upload.array('images'), imageController.addImages);

// Delete a specific image associated with a shipping ID and image ID
router.delete('/delete/:shippingId/:imageId', imageController.deleteImage);

// Exporting the router for use in other parts of the application
module.exports = router;
