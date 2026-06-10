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

function resolveRequestedRole(role) {
  const normalizedRole = normalizeRole(role) || ROLES.CUSTOMER;

  if (!ROLE_VALUES.includes(normalizedRole)) {
    const error = new Error("Invalid user role");
    error.statusCode = 400;
    throw error;
  }

  return normalizedRole;
}

// REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, role } = req.body;
  const requestedRole = resolveRequestedRole(role);
  const usersCount = await User.estimatedDocumentCount();

  if (PRIVILEGED_ROLES.has(requestedRole) && usersCount > 0) {
    res.status(403);
    throw new Error("Only an admin can create staff accounts");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: requestedRole,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

// LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email");
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