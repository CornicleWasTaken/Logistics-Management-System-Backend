import Shipment from "../models/Shipment.js";

// CREATE SHIPMENT
export const createShipment = async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);

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
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipment Updated",
      shipment,
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
