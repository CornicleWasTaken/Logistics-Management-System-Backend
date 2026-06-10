import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { normalizeRole, ROLE_VALUES, ROLES } from "../utils/roles.js";

const PRIVILEGED_ROLES = new Set([
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.WAREHOUSE_STAFF,
  ROLES.DRIVER,
]);

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function resolveRequestedRole(role) {
  const normalizedRole = normalizeRole(role) || ROLES.CUSTOMER;

  if (!ROLE_VALUES.includes(normalizedRole)) {
    const error = new Error("Invalid user role");
    error.statusCode = 400;
    throw error;
  }

  return normalizedRole;
}

function assertBootstrapKey(req) {
  const configuredKey = process.env.ADMIN_BOOTSTRAP_KEY;
  const providedKey = req.headers["x-admin-bootstrap-key"] || req.body.bootstrapKey;

  if (!configuredKey) {
    const error = new Error("Admin bootstrap key is not configured on backend");
    error.statusCode = 503;
    throw error;
  }

  if (!providedKey || providedKey !== configuredKey) {
    const error = new Error("Invalid admin bootstrap key");
    error.statusCode = 403;
    throw error;
  }
}

// REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, role } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const requestedRole = resolveRequestedRole(role);
  const adminExists = await User.exists({ role: ROLES.ADMIN });
  const isFirstAdminBootstrap = requestedRole === ROLES.ADMIN && !adminExists;

  if (PRIVILEGED_ROLES.has(requestedRole) && !isFirstAdminBootstrap) {
    res.status(403);
    throw new Error("Only an admin can create staff accounts. Use admin bootstrap or /api/users with admin login.");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: requestedRole,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

// SECURE ADMIN BOOTSTRAP / RESET
export const bootstrapAdmin = asyncHandler(async (req, res) => {
  assertBootstrapKey(req);

  const { name, email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password) {
    res.status(400);
    throw new Error("name, email, and password are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: ROLES.ADMIN,
    },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  );
  const token = signToken(user);

  res.status(200).json({
    success: true,
    message: "Admin bootstrap completed",
    token,
    data: user,
  });
});

// LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(401);
    throw new Error("No account found for this email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  const token = signToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: user,
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});