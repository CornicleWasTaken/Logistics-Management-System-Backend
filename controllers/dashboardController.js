import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import Shipment from "../models/Shipment.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Orders
    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    // Inventory
    const totalInventory = await Inventory.countDocuments();

    const lowStockItems = await Inventory.find({
      quantity: { $lt: 10 },
    });

    // Shipments
    const totalShipments = await Shipment.countDocuments();

    const deliveredShipments = await Shipment.countDocuments({
      status: "Delivered",
    });

    const activeShipments = await Shipment.countDocuments({
      status: {
        $in: ["Packed", "In Transit", "Out For Delivery"],
      },
    });

    // Drivers
    const availableDrivers = await Driver.countDocuments({
      status: "available",
    });

    const assignedDrivers = await Driver.countDocuments({
      status: "assigned",
    });

    // Vehicles
    const availableVehicles = await Vehicle.countDocuments({
      status: "available",
    });

    res.status(200).json({
      success: true,

      stats: {
        totalOrders,
        deliveredOrders,
        pendingOrders,

        totalInventory,
        lowStockCount: lowStockItems.length,

        totalShipments,
        deliveredShipments,
        activeShipments,

        availableDrivers,
        assignedDrivers,

        availableVehicles,
      },

      lowStockItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
