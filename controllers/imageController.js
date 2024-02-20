const { Shipping, Image } = require("./../models/Shipping");

const addImages = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const savedImages = await Image.create(req.files);
    const existingShipping = await Shipping.findById(id);

    if (!existingShipping) {
      return res.status(404).json({ error: 'Shipping record not found' });
    }

    existingShipping.images.push(...savedImages);
    await existingShipping.save();

    res.status(200).json({ message: 'Images added to Shipping record successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const deleteImage = async (req, res) => {
  const { shippingId, imageId } = req.params;

  try {
    const image = await Image.findByIdAndDelete(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image document not found' });
    }
    const shipping = await Shipping.findById(shippingId);

    if (!shipping) {
      return res.status(404).json({ error: 'Shipping document not found' });
    }

    shipping.images = shipping.images.filter(image => image._id != imageId);

    await shipping.save();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  addImages,
  deleteImage,
}