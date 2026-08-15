import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authorUser = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await User.findById(decoded_token.userId).select("-password");

    if(!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, Invalid or expired token."
    });
  }
};

export default authorUser;