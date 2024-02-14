const express = require("express");
const router = express.Router();

const upload = require("./../../utils/upload/upload");
const imageController = require("./../../controllers/imageController");


router.post('/add/:id', upload.array('images'), imageController.addImages);

router.delete('/delete/:shippingId/:imageId', imageController.deleteImage);

module.exports = router;
