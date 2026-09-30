import User from "../models/User.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// Get logged-in user
export const getCurrentUser = async (req, res) => {
  try {

    const user = await User.findById(req.userId).select("username email firstName lastName profilePicture bio");

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
    }).select("username firstName lastName profilePicture bio");

    res.status(200).json({
      users
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users"
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {

    const {firstName, lastName, bio} = req.body;

    const user = await User.findById(req.userId);

    if(!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if(firstName !== undefined) {
      user.firstName = firstName.trim();
    }

    if(lastName !== undefined) {
      user.lastName = lastName.trim();
    }

    if(req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "real-time-chat/profiles");

      user.profilePicture = result.secure_url;
    }

    if(bio !== undefined) {
      user.bio = bio.trim();
    }

    await user.save();

    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      bio: user.bio,
    };

    res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser,
    });
    
  } catch (error) {
    console.error("Update profile error: ", error);

    res.status(500).json({
      message: "Failed to update profile"
    });
  }
};