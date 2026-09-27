import User from "../models/User.js";

// Get logged-in user
export const getCurrentUser = async (req, res) => {
  try {

    const user = await User.findById(req.userId).select("-password");

    if(!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user"
    }); 
  }
};

// Get all users except logged-in user
export const getUsers = async (req, res) => {
  try {

    const users = await User.find({
      _id: {$ne: req.userId},
    }).select("-password");

    res.status(200).json({
      users
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users"
    });
  }
};