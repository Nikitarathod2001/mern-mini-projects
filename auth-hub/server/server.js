import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";


const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRouter);

app.listen(PORT, () =>{
  console.log(`Server is running on http://localhost:${PORT}`);
});