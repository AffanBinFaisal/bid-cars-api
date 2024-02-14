const { Shipping } = require("../models/Shipping");

const getShippingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    const shipping = await Shipping.findOne({
      _id: id,
      email: email,
    });
    if (shipping) {
      res.status(200).json({ shipping });
    } else {
      res.status(404).json({ error: "Shipping not found" });
    }
  } catch (error) {
    console.error("Error fetching shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getActiveShippings = async (req, res) => {
  try {
    const { email } = req.user;
    const shippings = await Shipping.find({ email: email, active: true });

    if (shippings.length > 0) {
      res.status(200).json({ shippings });
    } else {
      res.status(404).json({ error: "No active shippings found for the user" });
    }
  } catch (error) {
    console.error("Error fetching active shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getCompletedShippings = async (req, res) => {
  try {
    const { email } = req.user;
    const shipping = await Shipping.findOne({ email: email, active: false });

    if (shipping) {
      res.status(200).json({ shipping });
    } else {
      res.status(404).json({ error: "Completed shipping not found" });
    }
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const createShipping = async (req, res) => {
  const { email } = req.user;
  const { vehicle, status } = req.body;
  try {
    const shipping = Shipping({
      email: email,
      vehicle: vehicle,
      status: status,
      active: true,
    });
    await shipping.save();
    res.status(200).end();
  } catch (error) {
    console.error("Error creating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


const updateShipping = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedData = req.body;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updatedShipping = await Shipping.findByIdAndUpdate(
      id,
      {
        $set: updatedData,
      },
      { new: true }
    );

    if (!updatedShipping) {
      return res.status(404).json({ error: "Shipping not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Error updating shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const deleteShipping = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedShipping = await Shipping.findByIdAndDelete(id);

    if (!deletedShipping) {
      return res.status(404).json({ error: "Shipping not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting shipping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getAllShippings = async (req, res) => {
  const filters = req.query;
  try {
    const shippings = await Shipping.find(filters);

    if (!shippings || shippings.length === 0) {
      return res.status(404).json({ error: "No shippings found" });
    }

    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUserShippings = async (req, res) => {
  const { email } = req.user;
  try {
    const shippings = await Shipping.find({ email });

    if (!shippings || shippings.length === 0) {
      return res.status(404).json({ error: "No shippings found" });
    }

    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getShippingById,
  getAllUserShippings,
  getActiveShippings,
  getCompletedShippings,
  createShipping,
  updateShipping,
  deleteShipping,
  getAllShippings,
}