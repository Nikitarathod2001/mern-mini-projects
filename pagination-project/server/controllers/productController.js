import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const products = await Product.find()
                      .skip(skip)
                      .limit(limit);

    const totalItems = await Product.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
    
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};