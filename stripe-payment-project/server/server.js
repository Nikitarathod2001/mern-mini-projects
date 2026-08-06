import express from "express";
import cors from "cors";
import "dotenv/config";

import stripe from "./config/stripe.js";

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

app.post("/create-checkout-session", async (req, res) => {
  try {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Wireless Headphones",
            },
            unit_amount: 99900,
          },
          quantity: 1,
        }
      ],

      mode: "payment",

      success_url: "http://localhost:5173/success",

      cancel_url: "http://localhost:5173",
    });

    res.json({
      url: session.url,
    });
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});