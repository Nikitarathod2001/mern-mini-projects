import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import noteRouter from "./routes/noteRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;
await connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", noteRouter);


app.get("/", (req, res) => {
  res.send("Server is running....");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});