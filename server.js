import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import morgan from "morgan";
import helmet from "helmet";

import rateLimit from "express-rate-limit";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import dispatchRoutes from "./routes/dispatchRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// ERROR MIDDLEWARE
import errorHandler from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());

app.use(cors());

app.use(morgan("dev"));

app.use(helmet());

// RATE LIMIT
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// DATABASE CONNECTION
let isConnected = false;

async function connectToMongoDB() {
  if (!isConnected) {
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    isConnected = true;
  }
}

// Ensure Database Connection for every request
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("LOMS Backend Running...");
});

// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/shipments", shipmentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/drivers", driverRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/warehouses", warehouseRoutes);

app.use("/api", dispatchRoutes);

app.use("/api/notifications", notificationRoutes);

// ERROR HANDLER
app.use(errorHandler);

// PORT
//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => {
//  console.log(`Server running on port ${PORT}`);
//});


//Don't use app.listen() when running on vercel, export the app instead
export default app;
