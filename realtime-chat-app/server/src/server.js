import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import {createServer} from "http";
import {Server} from "socket.io";
import jwt from "jsonwebtoken";


const app = express();

const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.json({
    message: "Real-Time Chat App is running",
  });
});

// Endpoints
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

// Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected: ", socket.id);
  });
});

io.use((socket, next) => {
  try {

    const token = socket.handshake.auth.token;

    if(!token) {
      return next(new Error("Authentication required"));
    }

    const decodedToken = jwt.verify(
      token, process.env.JWT_SECRET
    );

    socket.userId = decodedToken.userId;

    next();
    
  } catch (error) {
    next(new Error("Invalid token"));
  }
});

const startServer = async () => {
  try {

    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("Failed to start server: ", error.message);
    process.exit(1);
  }
};

startServer();