const { Shipping, Image } = require("./../models/Shipping");

// Add images to a shipping record by its ID
const addImages = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if files are present in the request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Save the uploaded images to the database
    const savedImages = await Image.create(req.files);
    
    // Find the existing shipping record by its ID
    const existingShipping = await Shipping.findById(id);

    // Return an error if the shipping record is not found
    if (!existingShipping) {
      return res.status(404).json({ error: 'Shipping record not found' });
    }

    // Add the saved images to the existing shipping record
    existingShipping.images.push(...savedImages);
    await existingShipping.save();

    // Respond with success message
    res.status(200).json({ message: 'Images added to Shipping record successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Delete an image from a shipping record by its ID
const deleteImage = async (req, res) => {
  const { shippingId, imageId } = req.params;

  try {
    // Find and delete the image document by its ID
    const image = await Image.findByIdAndDelete(imageId);
    
    // Return an error if the image document is not found
    if (!image) {
      return res.status(404).json({ error: 'Image document not found' });
    }

    // Find the shipping record by its ID
    const shipping = await Shipping.findById(shippingId);

    // Return an error if the shipping record is not found
    if (!shipping) {
      return res.status(404).json({ error: 'Shipping document not found' });
    }

    // Remove the deleted image from the shipping record's images array
    shipping.images = shipping.images.filter(image => image._id != imageId);

    // Save the updated shipping record
    await shipping.save();

    // Respond with success message
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  addImages,
  deleteImage,
};
