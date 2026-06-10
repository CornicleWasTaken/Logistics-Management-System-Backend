import Shipment from "../models/Shipment.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import { normalizeRole, PERMISSIONS, ROLES } from "../utils/roles.js";
import { getIo } from "../sockets/trackingSocket.js";
import { computeEta } from "../services/etaService.js";

const LIMITED_SHIPMENT_UPDATE_ROLES = new Set([ROLES.DRIVER, ROLES.WAREHOUSE_STAFF]);
const SHIPMENT_STATUS_UPDATE_FIELDS = new Set(["status", "currentLocation", "speed", "lastSeen"]);

// CREATE SHIPMENT
export const createShipment = async (req, res) => {
  try {
    let shipmentData = { ...req.body };
    if (shipmentData.trackingNumber && !shipmentData.trackingId) {
      shipmentData.trackingId = shipmentData.trackingNumber;
    }

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
    let filter = {};
    const searchKeyword = req.query.search || req.query.keyword;

    if (req.user.role === ROLES.DRIVER) {
      const driver = await Driver.findOne({ userId: req.user.id });
      if (driver) {
        filter.driverId = driver._id;
      } else {
        filter.driverId = null;
      }
    } else if (req.user.role === ROLES.CUSTOMER) {
      const orders = await Order.find({ customerId: req.user.id }).select("_id");
      const orderIds = orders.map((order) => order._id);
      filter.orderId = { $in: orderIds };
    }

    if (searchKeyword) {
      const regex = new RegExp(String(searchKeyword), "i");
      filter.$or = [
        { trackingId: regex },
        { origin: regex },
        { destination: regex },
        { status: regex },
      ];
    }

    const shipments = await Shipment.find(filter).populate("orderId");

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
    if (updateData.trackingNumber && !updateData.trackingId) {
      updateData.trackingId = updateData.trackingNumber;
    }

    if (typeof updateData.currentLocation === "string") {
      updateData.currentLocation = {
        address: updateData.currentLocation,
      };
    }

    const userRole = normalizeRole(req.user?.role);

    if (LIMITED_SHIPMENT_UPDATE_ROLES.has(userRole)) {
      const blockedFields = Object.keys(updateData).filter((field) => !SHIPMENT_STATUS_UPDATE_FIELDS.has(field));

      if (blockedFields.length > 0) {
        return res.status(403).json({
          success: false,
          message: "This role can only update shipment status or location",
          blockedFields,
        });
      }
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

// GET shipment location/history
export const getShipmentHistory = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).select("locationHistory status trackingId");

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const history = (shipment.locationHistory || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.status(200).json({
      success: true,
      trackingId: shipment.trackingId,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Public or authenticated location update (REST fallback for devices/webhooks)
export const updateShipmentLocationPublic = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    let authorized = false;

    if (apiKey && process.env.TRACKING_API_KEY && apiKey === process.env.TRACKING_API_KEY) {
      authorized = true;
    } else if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = normalizeRole(decoded.role);
        if (role && PERMISSIONS.UPDATE_SHIPMENT_STATUS.includes(role)) authorized = true;
      } catch (error) {
        authorized = false;
      }
    }

    if (!authorized) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { coordinates, address, status } = req.body;

    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      shipment.currentLocation.coordinates.coordinates = coordinates;
      shipment.currentLocation.address = address || shipment.currentLocation.address;

      shipment.locationHistory.push({
        coordinates,
        timestamp: new Date(),
        status: status || shipment.status,
      });
    }

    if (status) shipment.status = status;

    if (req.body.speed) {
      shipment.speed = Number(req.body.speed);
    }

    shipment.lastSeen = new Date();

    try {
      const eta = computeEta({ currentCoords: shipment.currentLocation.coordinates.coordinates, routeGeoJSON: shipment.routeGeoJSON, speedKmph: shipment.speed });
      if (eta) shipment.eta = eta;
    } catch (error) {
      console.warn("ETA compute failed:", error.message);
    }

    await shipment.save();

    try {
      const io = getIo();
      const payload = {
        trackingId: shipment.trackingId,
        coordinates: shipment.currentLocation.coordinates.coordinates,
        address: shipment.currentLocation.address,
        status: shipment.status,
        timestamp: new Date().toISOString(),
      };

      io.to(`tracking_${shipment.trackingId}`).emit("location_updated", payload);
    } catch (error) {
      console.warn("Socket emit failed:", error.message);
    }

    res.status(200).json({ success: true, shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};