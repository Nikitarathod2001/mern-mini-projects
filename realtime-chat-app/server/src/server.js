import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;

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

const startServer = async () => {
  try {

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("Failed to start server: ", error.message);
    process.exit(1);
  }
};

startServer();