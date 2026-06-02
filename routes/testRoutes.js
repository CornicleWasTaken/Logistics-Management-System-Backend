import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome to Dashboard",
    user: req.user,
  });
});

export default router;
