const Shipping = require("../models/Shipping");

const getActiveShippings = async (req, res) => {
  try {
    const { email } = req.user;
    const shippings = await Shipping.find({ email: email, active: 1 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getCompletedShippings = async (req, res) => {
  try {
    const { email } = req.user;
    const shippings = await Shipping.find({ email: email, active: 0 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const createShipping = async (req, res) => {
  const { email } = req.user;
  const { vehicle, status } = req.body;
  try {
    const shipping = new Shipping({
      email: email,
      vehicle: vehicle,
      status: status,
      active: 1,
    });
    await shipping.save();
    res.status(200).end();
  } catch (error) {
    console.error("Error creating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateShipping = async (req, res) => {
  const id = req.params.id; // Corrected the property name to access route parameters
  try {
    const { active, status } = req.body;
    const updatedShipping = await Shipping.findByIdAndUpdate(
      id,
      {
        $set: {
          active: active,
          status: status,
        },
      },
      { new: true }
    );

    if (!updatedShipping) {
      return res.status(404).json({ error: "Shipping not found" });
    }
    res.status(200).end();
  } catch (error) {
    console.error("Error updating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteShipping = async (req, res) => {
  const id = req.params.id; // Corrected the property name to access route parameters
  try {
    const deletedShipping = await Shipping.findByIdAndDelete(id);

    if (!deletedShipping) {
      return res.status(404).json({ error: "Shipping not found" });
    }

    res.status(200).end();
  } catch (error) {
    console.error("Error deleting shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getActiveShippings,
  getCompletedShippings,
  createShipping,
  updateShipping,
  deleteShipping,
}