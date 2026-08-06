import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productId: Number,
  productName: String,
  amount: Number,
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
}, {timestamps: true});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;