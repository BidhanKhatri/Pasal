import ProductModel from "../models/product.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

export const productController = async (req, res) => {
  try {
    const {
      name,
      category,
      subcategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    const images = req.files; // `req.files` is an array of uploaded files

    console.log(
      name,
      images,
      category,
      subcategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details
    );

    if (!images || !images.length) {
      return res.status(400).json({
        msg: "At least one image is required",
        error: true,
        success: false,
      });
    }

    // Use Promise.all to upload all images
    const uploadResults = await Promise.all(
      images.map((img) => uploadImageCloudinary(img)) // Pass `img` directly
    );

    // Validate required fields
    if (
      !name ||
      !images.length ||
      !subcategory?.length ||
      !unit ||
      !category?.length ||
      !stock ||
      !price ||
      !discount ||
      !description
    ) {
      return res.status(400).json({
        msg: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Save the product to the database
    const uploadProduct = new ProductModel({
      name,
      image: uploadResults, // Save all uploaded image URLs
      category,
      subcategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    await uploadProduct.save();

    return res.status(200).json({
      msg: "Product added successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      msg: error.message || error,
      success: false,
      error: true,
    });
  }
};
