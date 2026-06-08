import asyncHandler from "express-async-handler";
import Shipment from "../models/Shipment.js";
import Order from "../models/Order.js";
import Driver from "../models/Driver.js";
import { generateExcelReport } from "../utils/excelGenerator.js";
import { generatePdfReport } from "../utils/pdfGenerator.js";

// GET /api/reports/deliveries
export const getDeliveriesReport = asyncHandler(async (req, res) => {
  const { format, startDate, endDate } = req.query;

  let matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const shipments = await Shipment.aggregate([
    { $match: matchStage },
    {
      $project: {
        trackingId: 1,
        status: 1,
        createdAt: 1,
        actualDeliveryDate: 1,
        estimatedDeliveryDate: 1,
      },
    },
  ]);

  if (format === "excel") {
    const columns = [
      { header: "Tracking ID", key: "trackingId", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Actual Delivery", key: "actualDeliveryDate", width: 25 },
      { header: "Estimated Delivery", key: "estimatedDeliveryDate", width: 25 },
    ];
    return generateExcelReport(res, shipments, columns, "deliveries_report");
  }

  if (format === "pdf") {
    return generatePdfReport(res, "Deliveries Report", shipments, "deliveries_report");
  }

  res.status(200).json({ success: true, data: shipments });
});

// GET /api/reports/revenue
export const getRevenueReport = asyncHandler(async (req, res) => {
  const { format, startDate, endDate } = req.query;

  let matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const orders = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalRevenue: { $sum: "$totalAmount" },
        orderVolume: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const formattedData = orders.map((o) => ({
    month: `${o._id.year}-${String(o._id.month).padStart(2, "0")}`,
    totalRevenue: o.totalRevenue || 0,
    orderVolume: o.orderVolume || 0,
  }));

  if (format === "excel") {
    const columns = [
      { header: "Month", key: "month", width: 15 },
      { header: "Total Revenue", key: "totalRevenue", width: 20 },
      { header: "Order Volume", key: "orderVolume", width: 15 },
    ];
    return generateExcelReport(res, formattedData, columns, "revenue_report");
  }

  if (format === "pdf") {
    return generatePdfReport(res, "Revenue Report", formattedData, "revenue_report");
  }

  res.status(200).json({ success: true, data: formattedData });
});

// GET /api/reports/drivers
export const getDriversReport = asyncHandler(async (req, res) => {
  const { format } = req.query;

  const drivers = await Driver.find({}, "name email status completedDeliveries rating").lean();

  if (format === "excel") {
    const columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Completed Deliveries", key: "completedDeliveries", width: 20 },
      { header: "Rating", key: "rating", width: 10 },
    ];
    return generateExcelReport(res, drivers, columns, "drivers_report");
  }

  if (format === "pdf") {
    return generatePdfReport(res, "Drivers Report", drivers, "drivers_report");
  }

  res.status(200).json({ success: true, data: drivers });
});