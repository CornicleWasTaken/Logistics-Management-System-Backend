import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import asyncHandler from "express-async-handler";

import { validationResult } from "express-validator";

// REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
  // VALIDATION CHECK
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);

    throw new Error(errors.array()[0].msg);
  }

  const { username, password, role } = req.body;

  // CHECK USER
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400);

    throw new Error("User already exists");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // CREATE USER
  const user = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

// LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // CHECK USER
  const user = await User.findOne({ username });

  if (!user) {
    res.status(401);

    throw new Error("Invalid username");
  }

  // PASSWORD CHECK
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);

    throw new Error("Invalid password");
  }

  // TOKEN
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: user,
  });
});
