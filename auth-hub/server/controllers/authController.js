import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import {google} from "googleapis";
import oauth2Client from "../config/google.js";
import crypto from "crypto";
import OTP from "../models/OTP.js";
import transporter from "../config/email.js";
import generateOtp from "../utils/generateOtp.js";

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

// -------- Send OTP ---------
export const sendOtp = async (req, res) => {
  try {

    const {email} = req.body;

    if(!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingOtp = await OTP.findOne({
      email: normalizedEmail,
    });

    if(existingOtp) {
      const elapsedTime = Date.now() - existingOtp.lastSentAt.getTime();

      const cooldown = 60 * 1000;

      if(elapsedTime < cooldown) {
        const remainindSeconds = Math.ceil(
          (cooldown - elapsedTime) / 1000
        );

        return res.status(429).json({
          message: `Please wait ${remainindSeconds} seconds before requesting another OTP.`
        });
      }

      if(existingOtp.requestCount >= 5) {
        return res.status(429).json({
          message: "Maximum OTP requests reached. Please try again later.",
        });
      }
    }

    const otp = generateOtp();

    const hashedOtp = crypto.createHash("sha256")
                            .update(otp)
                            .digest("hex");

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    if(existingOtp) {
      existingOtp.otp = hashedOtp;
      existingOtp.expiresAt = expiresAt;
      existingOtp.attempts = 0;
      existingOtp.requestCount += 1;
      existingOtp.lastSentAt = new Date();

      await existingOtp.save();
    }
    else {
      await OTP.create({
        email: normalizedEmail,
        otp: hashedOtp,
        expiresAt,
        requestCount: 1,
        lastSentAt: new Date(),
      });
    }

    await transporter.sendMail({
      from: `"AuthHub" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your AuthHub OTP",
      text: `Your AuthHub OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({
      message: "OTP sent successfully",
    });
    
  } catch (error) {
    console.error("Send OTP Error: ", error);

    res.status(500).json({
      message: "Failed to send OTP"
    });
  }
};


// ------- Verify OTP --------
export const verifyOtp = async (req, res) => {
  try {

    const {email, otp} = req.body;

    if(!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
    });

    if(!otpRecord) {
      return res.status(400).json({
        message: "OTP not found or expired",
      });
    }

    if(otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if(otpRecord.attempts >= 5) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "Too many incorrect attempts",
      });
    }

    const hashedOtp = crypto.createHash("sha256")
                            .update(otp)
                            .digest("hex");

    if(hashedOtp != otpRecord.otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if(!user) {
      user = await User.create({
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: null,
        role: "user",
        provider: "otp",
      });
    }

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
    
  } catch (error) {
    console.error("Verify OTP error: ", error);

    res.status(500).json({
      message: "OTP verification failed",
    });
  }
};