import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance", "inactive"],
      default: "available",
    },
    capacity: { type: Number, required: true },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
  },
  { timestamps: true },
);

vehicleSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
