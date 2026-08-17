import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    default: null,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  provider: {
    type: String,
    enum: ["local", "google", "otp"],
    default: "local",
  },

  providerId: {
    type: String,
    default: null,
  },

}, {timestamps: true});

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if(!this.isModified("password")) {
//     return next;
//   }

//   const salt = await bcrypt.genSalt(10);

//   this.password = await bcrypt.hash(this.password, salt);

//   next;
// });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;