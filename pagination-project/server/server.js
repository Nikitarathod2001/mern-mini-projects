import express from "express";
import "dotenv/config";
import cors from "cors";

import connectDB from "./config/db.js";
import productRouter from "./routes/productRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/products", productRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});