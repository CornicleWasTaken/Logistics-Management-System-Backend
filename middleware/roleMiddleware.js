import { normalizeRole } from "../utils/roles.js";

export const authorizeRoles = (...roles) => {
  const allowedRoles = roles.flat().map(normalizeRole).filter(Boolean);

  return (req, res, next) => {
    const userRole = normalizeRole(req.user?.role);

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || "unknown"}) is not allowed`,
      });
    }

    req.user.role = userRole;
    next();
  };
};