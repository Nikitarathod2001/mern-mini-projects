import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const product = {
  id: 1,
  name: "Wireless Headphones",
  description: "Premium Bluetooth Headphones",
  price: 999,
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
};

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.get("/api/product", (req, res) => {
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});