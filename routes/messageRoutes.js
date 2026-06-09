import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCustomerMessageHistory, getShipmentMessageHistory, createMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/customer/:customerId", protect, getCustomerMessageHistory);
router.get("/shipment/:shipmentId", protect, getShipmentMessageHistory);
router.post("/", protect, createMessage);

export default router;
