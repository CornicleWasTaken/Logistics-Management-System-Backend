import Driver from "../models/Driver.js";
import Shipment from "../models/Shipment.js";

// GET /api/drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("vehicleId");
    res.status(200).json({
      success: true,
      data: drivers,
      meta: { totalCount: drivers.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/drivers
export const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/drivers/:id
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/drivers/me/assignments
export const getDriverAssignments = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user.id });
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver profile not found" });
    }

    const shipments = await Shipment.find({ driverId: driver._id })
      .populate("orderId")
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

// DELETE /api/drivers/:id
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    res.status(200).json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};