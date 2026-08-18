import "dotenv/config";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import products from "./data/products.js";

const seedProducts = async () => {
  try {

    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products inserted successfully");

    process.exit(0);
    
  } catch (error) {
    console.error("Error seeding products: ", error.message);
    process.exit(1);
  }
};

seedProducts();