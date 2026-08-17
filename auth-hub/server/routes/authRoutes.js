import express from "express";
import { register, login, getProfile, getAdminDashboard, googleCallback, googleLogin, sendOtp, verifyOtp } from "../controllers/authController.js";
import authorUser from "../middleware/authMiddleware.js";
import authorizeAdmin from "../middleware/authorizeMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/profile", authorUser, getProfile);
authRouter.get("/admin/dashboard", authorUser, authorizeAdmin("admin"), getAdminDashboard);

authRouter.get("/google", googleLogin);
authRouter.get("/google/callback", googleCallback);

authRouter.post("/otp/send", sendOtp);
authRouter.post("/otp/verify", verifyOtp);

export default authRouter;