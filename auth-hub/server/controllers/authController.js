import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import {google} from "googleapis";
import oauth2Client from "../config/google.js";
import crypto from "crypto";

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

  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSit: "lax",
    maxAge: 10 * 60 * 1000,
  });
  
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile",
    ],
    state,
    prompt: "consent",
  });

  res.redirect(authorizationUrl);

}

// ------- Google Callback --------

export const googleCallback = async (req, res) => {
  try {

    if(req.query.error) {
      return res.status(400).json({
        message: "Google authentication was cancelled"
      });
    }

    const {code, state} = req.query;

    if(!code) {
      return res.status(400).json({
        message: "Authorization code missing",
      });
    }

    const savedState = req.cookies.oauth_state;

    if(!state || !savedState || state !== savedState) {
      return res.status(400).json({
        message: "Invalid OAuth state",
      });
    }

    res.clearCookie("oauth_state");

    const {tokens} = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const {data} = await oauth2.userinfo.get();

    if(!data.verified_email) {
      return res.status(400).json({
        message: "Google email is not verified",
      });
    }

    let user = await User.findOne({
      provider: "google",
      providerId: data.id,
    });

    if(!user) {
      const existingUser = await User.findOne({
        email: data.email,
      });

      if(existingUser) {
        return res.status(409).json({
          message: "An account with this email already exists. Please login using your existing method."
        });
      }

      user = await User.create({
        name: data.name,
        email: data.email,
        provider: "google",
        providerId: data.id,
        role: "user",
      });
    }

    const token = generateToken(user._id, user.role);

    // res.json({
    //   message: "Google login successful",
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //     provider: user.provider,
    //   },
    // });

    const frontendUrl = process.env.CLIENT_URL;

    res.redirect(
      `${frontendUrl}/oauth-success?token=${token}`
    );
    
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