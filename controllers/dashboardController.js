import Order from "../models/Order.js";

import Inventory from "../models/Inventory.js";

import Shipment from "../models/Shipment.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Inventory
    const totalInventory = await Inventory.countDocuments();

    // Total Shipments
    const totalShipments = await Shipment.countDocuments();

    // Delivered Orders
    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    // Low Stock Items
    const lowStockItems = await Inventory.find({
      quantity: { $lt: 10 },
    });

    res.status(200).json({
      success: true,

      stats: {
        totalOrders,
        totalInventory,
        totalShipments,
        deliveredOrders,
        pendingOrders,
        lowStockCount: lowStockItems.length,
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
