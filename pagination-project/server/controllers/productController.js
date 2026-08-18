import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {

    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
    
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};