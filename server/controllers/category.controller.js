import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

//add category
export const addCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file;
    console.log(name, image);

    if (!name || !image) {
      return res.status(400).json({
        msg: "All fields are required",
        success: false,
        error: true,
      });
    }

    //aako image lie cloudinary ma upload garni
    const uploadImage = await uploadImageCloudinary(image);

    const uploadCategory = new CategoryModel({
      name,
      image: uploadImage.url,
    });

    const saveCategory = await uploadCategory.save();

    if (!saveCategory) {
      return res.status(400).json({
        msg: "Category not saved",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      msg: `Category ${name} added`,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      success: false,
      errror: true,
    });
  }
};

//get all category
export const getAllCategoryController = async (req, res) => {
  try {
    const getAllCategory = await CategoryModel.find();

    if (!getAllCategory) {
      return res.status(400).json({
        msg: "Unable to get category",
        error: false,
        success: true,
      });
    }

    const formattedCategory = getAllCategory.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        image: category.image,
      };
    });

    return res.status(200).json({
      msg: "Category fetched",
      data: formattedCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.json({
      msg: error.message || error || "Internal server error",
      success: false,
      error: true,
    });
  }
};

//update single category
export const updateCategoryController = async (req, res) => {
  try {
    const { id, name } = req.body;
    const image = req.file;

    if (!id || !name) {
      return res.status(400).json({
        msg: "id and name are required",
        success: false,
        error: true,
      });
    }

    //ako image lie cloudinary ma upload garni
    const uploadImage = await uploadImageCloudinary(image);

    const updateCategory = await CategoryModel.updateOne(
      { _id: id },
      { $set: { name, image: uploadImage.url } },
      { new: true }
    );

    if (!updateCategory) {
      return res.status(400).json({
        msg: "Category not updated",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      msg: `Category updated to ${name}`,
      success: true,
      error: false,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        msg: "Category id is required",
        success: false,
        error: true,
      });
    }

    //checking if category is empty
    const checkSubCategory = await SubCategoryModel.find({
      category: { $in: [id] },
    }).countDocuments();

    const checkProduct = await ProductModel.find({
      category: { $in: [id] },
    }).countDocuments();

    if (checkProduct > 0 || checkSubCategory > 0) {
      return res.status(400).json({
        msg: "Category is not empty",
        success: false,
        error: true,
      });
    }

    const deleteCategory = await CategoryModel.deleteOne({ _id: id });

    if (deleteCategory.deletedCount === 0) {
      return res.status(400).json({
        msg: "Category not deleted",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      msg: `Category deleted`,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      success: false,
      error: true,
    });
  }
};
