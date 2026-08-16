import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import oauth2Client from "../config/google.js";

// --------- Register -------------

export const register = async (req, res) => {
  try {

    const {name, email, password} = req.body;

    // 1. Validate required fields
    if(!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Check if user alrady exists
    const exitingUser = await User.findOne({email});
    if(exitingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 3. Create User
    const user = await User.create({
      name, email, password,
    });

    // 4. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
  } catch (error) {
    console.log(`Registration error: ${error}`);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ----------- Login -----------

export const login = async (req, res) => {
  try {

    const {email, password} = req.body;

    // 1. Validate input
    if(!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find User
    const user = await User.findOne({email});

    if(!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate Token
    const token = generateToken(user._id, user.role);

    // 5. Login successful
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
    
  } catch (error) {
    console.error("Login error: ", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ------------ User Profile -----------

export const getProfile = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

// ----------- Admin Dashboard ----------

export const getAdminDashboard = async (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// -------- Google Login -----------

export const googleLogin = (req, res) => {
  
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile",
    ],
    prompt: "consent",
  });

  res.redirect(authorizationUrl);

}

// ------- Google Callback --------

export const googleCallback = async (req, res) => {
  try {

    const {code} = req.query;

    if(!code) {
      return res.status(400).json({
        message: "Authorization code missing",
      });
    }

    const {tokens} = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("Google OAuth successful");
    console.log("Tokens received");

    res.json({
      message: "Google Oauth successful",
    });
    
  } catch (error) {
    console.error(
      "Google OAuth error",
      error.message
    );

    res.status(500).json({
      message: "Google OAuth failed"
    });
  }
};