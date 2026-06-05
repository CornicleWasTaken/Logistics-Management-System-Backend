import express from "express";
import {
  assignDispatch,
  getTrackingDetails,
  optimizeRoute,
} from "../controllers/dispatchController.js";

const router = express.Router();

// Mount this base inside server.js under `/api`
router.post("/shipments/:id/assign", assignDispatch);
router.get("/shipments/:id/tracking", getTrackingDetails);
router.post("/dispatch/optimize-route", optimizeRoute);

export default router;
