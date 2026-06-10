import jwt from "jsonwebtoken";
import { normalizeRole } from "../utils/roles.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Bearer token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = normalizeRole(decoded.role);

    if (!role) {
      return res.status(403).json({
        success: false,
        message: "User role is not allowed",
      });
    }

    req.user = {
      ...decoded,
      id: decoded.id || decoded._id,
      role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};