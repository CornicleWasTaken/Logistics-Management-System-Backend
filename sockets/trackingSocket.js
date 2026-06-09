import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Shipment from "../models/Shipment.js";
import { computeEta } from "../services/etaService.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Configure this to restrict origins in production
      methods: ["GET", "POST"],
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded; // attach user to socket

      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `User connected to socket: ${socket.user.id}, socket id: ${socket.id}`,
    );

    // Driver or user subscribing to a specific tracking ID
    socket.on("subscribe_tracking", (trackingId) => {
      socket.join(`tracking_${trackingId}`);

      console.log(
        `User ${socket.user.id} joined tracking room: tracking_${trackingId}`,
      );
    });

    // Driver sending location updates
    socket.on("update_location", async (data) => {
      const { trackingId, coordinates, address, status } = data;

      // coordinates should be [longitude, latitude]

      if (!trackingId || !coordinates || coordinates.length !== 2) {
        return socket.emit("error", {
          message: "Invalid location data format.",
        });
      }

      // 1. Broadcast to everyone in the room immediately

      const trackingPayload = {
        trackingId,

        coordinates,

        address,

        status,

        timestamp: new Date().toISOString(),
      };

      io.to(`tracking_${trackingId}`).emit("location_updated", trackingPayload);

      // 2. Queue for database storage
      try {
        const shipment = await Shipment.findOne({ trackingId });
        if (shipment) {
          shipment.currentLocation.address = address || shipment.currentLocation.address;
          shipment.currentLocation.coordinates.coordinates = coordinates;
          if (status) shipment.status = status;
          shipment.locationHistory.push({ coordinates, address, status, timestamp: new Date() });
          shipment.lastSeen = new Date();
          if (data.speed) shipment.speed = Number(data.speed);

          // compute ETA
          try {
            const eta = computeEta({ currentCoords: shipment.currentLocation.coordinates.coordinates, routeGeoJSON: shipment.routeGeoJSON, speedKmph: shipment.speed });
            if (eta) shipment.eta = eta;
          } catch (e) {
            console.warn("ETA compute failed:", e.message);
          }

          await shipment.save();

          // include eta in tracking payload if present
          if (shipment.eta) trackingPayload.eta = shipment.eta.toISOString();
        }
      } catch (err) {
        console.error("Failed to update location in DB", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from socket: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }

  return io;
};
