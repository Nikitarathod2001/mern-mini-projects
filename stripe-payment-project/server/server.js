import express from "express";
import cors from "cors";
import "dotenv/config";

import stripe from "./config/stripe.js";
import Order from "./models/Order.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors());

app.post("/webhook", 
  express.raw({type: "application/json"}),
  async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    try {

      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
    } catch (error) {
      console.log(error.message);
      return res.sendStatus(400);
    }

    switch(event.type) {
      case "checkout.session.completed": 
        const session = event.data.object;

        const orderId = session.metadata.orderId;

        await Order.findByIdAndUpdate(orderId, {paymentStatus: "Paid"});

        console.log("Payment Successful");
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    res.json({
      received: true,
    });

  }
);

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

    const {id, name, price} = req.body;

    const order = await Order.create({
      productId: id,
      productName: name,
      amount: price,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        }
      ],

      metadata: {
        orderId: order._id.toString(),
      },

      mode: "payment",

      success_url: "http://localhost:5173/success",

      cancel_url: "http://localhost:5173/cancel",
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
