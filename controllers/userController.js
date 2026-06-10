import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import { normalizeRole, ROLE_VALUES, ROLES } from "../utils/roles.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getEmailQuery(email) {
  return { email: new RegExp(`^${escapeRegex(email)}$`, "i") };
}

function resolveRole(role) {
  const normalizedRole = normalizeRole(role) || ROLES.CUSTOMER;

  if (!ROLE_VALUES.includes(normalizedRole)) {
    const error = new Error("Invalid user role");
    error.statusCode = 400;
    throw error;
  }

  return normalizedRole;
}

async function syncDriverProfile(user, payload) {
  if (user.role !== ROLES.DRIVER) {
    return;
  }

  await Driver.findOneAndUpdate(
    { userId: user._id },
    {
      currentLocation: payload.currentLocation,
      name: user.name,
      phone: payload.phone || payload.driverPhone || "Pending",
      userId: user._id,
    },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  );
}

export const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  const role = normalizeRole(req.query.role);

  if (role) {
    filter.role = role;
  }

  if (req.query.keyword) {
    const keyword = new RegExp(String(req.query.keyword), "i");
    filter.$or = [{ name: keyword }, { email: keyword }];
  }

  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !normalizedEmail || !password) {
    res.status(400);
    throw new Error("name, email, and password are required");
  }

  const existingUser = await User.findOne(getEmailQuery(normalizedEmail));

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    role: resolveRole(role),
  });

  await syncDriverProfile(user, req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const updates = {};
  const allowedFields = ["name", "email", "role", "password"];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (updates.email) {
    updates.email = normalizeEmail(updates.email);
  }

  if (updates.role) {
    updates.role = resolveRole(updates.role);
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await syncDriverProfile(user, req.body);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user.id) === String(req.params.id)) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await Driver.findOneAndDelete({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});