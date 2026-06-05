import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["SMS", "Email", "InApp"], required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Sent", "Failed"], default: "Pending" },
  },
  { timestamps: true }
);

notificationSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;