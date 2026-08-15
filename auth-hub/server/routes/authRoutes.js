import express from "express";
import { register, login, getProfile, getAdminDashboard } from "../controllers/authController.js";
import authorUser from "../middleware/authMiddleware.js";
import authorizeAdmin from "../middleware/authorizeMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/profile", authorUser, getProfile);
authRouter.get("/admin/dashboard", authorUser, authorizeAdmin("admin"), getAdminDashboard);

export default authRouter;