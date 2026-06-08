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

export const getDashboardAnalytics = async (req, res) => {
  try {
    const currentDate = new Date();

    // A. Monthly Revenue Chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          revenue: 1,
        },
      },
    ]);

    // B. Deliveries per Month
    const deliveriesPerMonth = await Shipment.aggregate([
      { $match: { status: "Delivered", actualDeliveryDate: { $exists: true } } },
      {
        $group: {
          _id: { month: { $month: "$actualDeliveryDate" }, year: { $year: "$actualDeliveryDate" } },
          deliveries: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          deliveries: 1,
        },
      },
    ]);

    // C. Driver Performance
    const driverPerformance = await Shipment.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: "$driverId",
          completedDeliveries: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "_id",
          foreignField: "_id",
          as: "driverInfo",
        },
      },
      { $unwind: "$driverInfo" },
      {
        $project: {
          _id: 0,
          driverName: "$driverInfo.name",
          completedDeliveries: 1,
        },
      },
      { $sort: { completedDeliveries: -1 } },
      { $limit: 10 },
    ]);

    // D. Delayed Shipment Analysis
    const delayedShipmentAnalysis = await Shipment.aggregate([
      {
        $facet: {
          delayed: [
            {
              $match: {
                $or: [
                  { $expr: { $gt: ["$actualDeliveryDate", "$estimatedDeliveryDate"] } },
                  { status: { $ne: "Delivered" }, estimatedDeliveryDate: { $lt: currentDate } },
                ],
              },
            },
            { $count: "count" },
          ],
          onTime: [
            {
              $match: {
                status: "Delivered",
                $expr: { $lte: ["$actualDeliveryDate", "$estimatedDeliveryDate"] },
              },
            },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          delayed: { $ifNull: [{ $arrayElemAt: ["$delayed.count", 0] }, 0] },
          onTime: { $ifNull: [{ $arrayElemAt: ["$onTime.count", 0] }, 0] },
        },
      },
    ]);

    // E. Hub-wise Performance
    const hubWisePerformance = await Shipment.aggregate([
      {
        $group: {
          _id: "$warehouseId",
          totalShipments: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "warehouses",
          localField: "_id",
          foreignField: "_id",
          as: "warehouseInfo",
        },
      },
      { $unwind: { path: "$warehouseInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          hub: { $ifNull: ["$warehouseInfo.name", "Unknown Hub"] },
          totalShipments: 1,
          delivered: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue,
        deliveriesPerMonth,
        driverPerformance,
        delayedShipmentAnalysis: delayedShipmentAnalysis[0] || { delayed: 0, onTime: 0 },
        hubWisePerformance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
