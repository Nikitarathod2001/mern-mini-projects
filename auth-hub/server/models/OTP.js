import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },

  attempts: {
    type: Number,
    default: 0,
  },

  requestCount: {
    type: Number,
    default: 1,
  },

  lastSentAt: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export default OTP;