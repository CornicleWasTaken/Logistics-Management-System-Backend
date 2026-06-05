import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "assigned", "resting", "offline"],
      default: "available",
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    currentLocation: { type: String },
  },
  { timestamps: true }
);

driverSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;