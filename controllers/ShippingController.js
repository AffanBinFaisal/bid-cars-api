const getActiveShippings = async (req, res) => {
  try {
    const { username } = req.user;
    const shippings = await Shipping.find({ username: username, active: 1 });
    res.status(200).json({ shippings });
  } catch (error) {
    console.error("Error fetching shippings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

