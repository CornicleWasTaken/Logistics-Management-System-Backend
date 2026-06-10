import { Router } from "express";

import { bootstrapAdmin, registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/bootstrap-admin", bootstrapAdmin);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

export default router;