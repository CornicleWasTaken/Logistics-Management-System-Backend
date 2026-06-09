import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    shipmentId: { type: String },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ["customer", "driver", "system", "support"], default: "customer" },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

messageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
