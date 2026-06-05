import Shipment from "../models/Shipment.js";
import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";
import { getDistance } from "geolib";
// POST /api/shipments/:id/assign
export const assignDispatch = async (req, res) => {
  try {
    const { driverId, vehicleId } = req.body;

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
        message: "Delivered shipment cannot be assigned",
      });
    }

    if (shipment.driverId || shipment.vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Shipment already assigned",
      });
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Driver not available",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (vehicle.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Vehicle not available",
      });
    }

    shipment.driverId = driverId;
    shipment.vehicleId = vehicleId;

    await shipment.save();

    await Driver.findByIdAndUpdate(driverId, {
      status: "assigned",
    });

    await Vehicle.findByIdAndUpdate(vehicleId, {
      status: "assigned",
    });

    res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/shipments/:id/tracking
export const getTrackingDetails = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate("driverId")
      .populate("vehicleId");

    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/dispatch/optimize-route
export const optimizeRoute = async (req, res) => {
  try {
    const { locations } = req.body;

    if (!locations || !Array.isArray(locations) || locations.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Provide minimum 2 locations",
      });
    }

    const remaining = [...locations];

    const optimized = [];

    let current = remaining.shift();

    optimized.push(current);

    while (remaining.length > 0) {
      let nearestIndex = 0;

      let shortestDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const distance = getDistance(
          {
            latitude: current.latitude,
            longitude: current.longitude,
          },
          {
            latitude: remaining[i].latitude,

            longitude: remaining[i].longitude,
          },
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;

          nearestIndex = i;
        }
      }

      current = remaining.splice(nearestIndex, 1)[0];

      optimized.push(current);
    }

    let totalDistance = 0;

    for (let i = 0; i < optimized.length - 1; i++) {
      totalDistance += getDistance(
        {
          latitude: optimized[i].latitude,

          longitude: optimized[i].longitude,
        },
        {
          latitude: optimized[i + 1].latitude,

          longitude: optimized[i + 1].longitude,
        },
      );
    }

    const estimatedHours = totalDistance / 1000 / 40;

    res.status(200).json({
      success: true,

      totalDistanceKm: (totalDistance / 1000).toFixed(2),

      estimatedHours: estimatedHours.toFixed(2),

      optimizedRoute: optimized,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
