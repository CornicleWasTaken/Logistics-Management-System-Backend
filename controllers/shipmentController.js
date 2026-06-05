import Shipment from "../models/Shipment.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import Order from "../models/Order.js";
// CREATE SHIPMENT
export const createShipment = async (req, res) => {
  try {
    let shipmentData = { ...req.body };
    if (typeof shipmentData.currentLocation === "string") {
      shipmentData.currentLocation = {
        address: shipmentData.currentLocation,
      };
    }

    const shipment = await Shipment.create(shipmentData);

    res.status(201).json({
      success: true,
      message: "Shipment Created",
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL SHIPMENTS
export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().populate("orderId");

    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE SHIPMENT STATUS
export const updateShipment = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (typeof updateData.currentLocation === "string") {
      updateData.currentLocation = {
        address: updateData.currentLocation,
      };
    }

    const existingShipment = await Shipment.findById(req.params.id);

    if (!existingShipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    if (existingShipment.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered shipment cannot be modified",
      });
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Shipment Updated",
      shipment: updatedShipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// DELETE SHIPMENT
export const deleteShipment = async (req, res) => {
  try {
    await Shipment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Shipment Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const completeShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    if (shipment.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Shipment already delivered",
      });
    }

    shipment.status = "Delivered";

    await shipment.save();

    if (shipment.driverId) {
      await Driver.findByIdAndUpdate(shipment.driverId, {
        status: "available",
      });
    }

    if (shipment.vehicleId) {
      await Vehicle.findByIdAndUpdate(shipment.vehicleId, {
        status: "available",
      });
    }

    await Order.findByIdAndUpdate(shipment.orderId, {
      status: "Delivered",
    });

    res.status(200).json({
      success: true,
      message: "Shipment Delivered Successfully",
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getShipmentByTrackingId = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingId: req.params.trackingId,
    })
      .populate("orderId")
      .populate("driverId")
      .populate("vehicleId");

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
