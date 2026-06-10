import mongoose from "mongoose";
import { normalizeRole, ROLE_VALUES, ROLES } from "../utils/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.CUSTOMER,
      set: (value) => normalizeRole(value) || value,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;