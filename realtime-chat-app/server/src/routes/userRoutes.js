import express from "express";
import { getCurrentUser, getUsers } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getCurrentUser);
userRouter.get("/", protect, getUsers);

export default userRouter;