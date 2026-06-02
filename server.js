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

// DATABASE
//mongoose
//  .connect(process.env.MONGO_URI)
//  .then(() => {
//    console.log("MongoDB Connected");
//  })
//  .catch((error) => {
//    console.log(error);
//  });

let isConnected = false;

async function connectToMongoDB() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
      isConnected = true;
    } catch (error) {
      console.log(' Error connecting to MongoDB:', error);
    }
  }
}

// add middleware
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToMongoDB();
  }
  next();
});


// ERROR HANDLER
app.use(errorHandler);

// PORT
//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => {
//  console.log(`Server running on port ${PORT}`);
//});


//Don't use app.listen() when running on vercel, export the app instead
module.exports = app;
