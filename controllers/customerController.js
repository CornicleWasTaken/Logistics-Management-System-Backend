import Order from "../models/Order.js";
import Shipment from "../models/Shipment.js";

// GET /api/customers/me/shipments
export const getCustomerShipments = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).select("_id");
    const orderIds = orders.map(order => order._id);

    const shipments = await Shipment.find({ orderId: { $in: orderIds } })
      .populate("orderId")
      .populate("driverId")
      .populate("vehicleId");

    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
