import SubCategoryModel from "../models/subCategory.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import mongoose from "mongoose";

//add sub category
export const addSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file;

    console.log(name, category, image);

    if (!name || !category) {
      return res
        .status(400)
        .json({ msg: "All fields are required", error: true, success: false });
    }

    // Ensure category is an array of ObjectIds
    const categoryIds = Array.isArray(category)
      ? category.map((cat) => new mongoose.Types.ObjectId(cat)) // Convert each to ObjectId
      : [new mongoose.Types.ObjectId(category)]; // If single category, wrap in array

    // Convert category to an array of ObjectId

    const uploadImage = await uploadImageCloudinary(image);

    const uploadSubCategory = new SubCategoryModel({
      name,
      image: uploadImage.url,
      category: categoryIds,
    });

    const savedCategory = await uploadSubCategory.save();

    if (!uploadSubCategory) {
      return res
        .status(400)
        .json({ msg: "SubCategory not saved", error: true, success: false });
    }

    return res.status(200).json({
      msg: `${name} subcategory added.`,
      error: false,
      success: true,
      data: savedCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
};

//get all sub category
export const getAllSubCategory = async (req, res) => {
  try {
    const getAllSubCategory = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category"); //populate is used to display the referenced category

    if (!getAllSubCategory) {
      return res.status(400).json({
        msg: "Failed to get all sub category",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Sub category fetched",
      error: false,
      success: true,
      data: getAllSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      success: false,
      error: true,
    });
  }
};

//update the sub category
export const updateSubCategory = async (req, res) => {
  try {
    const { name, category, id } = req.body;
    const image = req.file;

    console.log(name, category, id, image);

    if (!name || !category || !image || !id) {
      return res.status(400).json({
        msg: "id, name, email and image are required",
        success: false,
        error: true,
      });
    }

    //upload the image in cloudinary
    const uploadImg = await uploadImageCloudinary(image);
    const categoryId = Array.isArray(category)
      ? category.map((cat) => new mongoose.Types.ObjectId(cat))
      : [new mongoose.Types.ObjectId(category)];

    const updatedSubCategory = await SubCategoryModel.updateOne(
      { _id: id },
      { $set: { name, image: uploadImg.url, category: categoryId } },
      { new: true }
    );
    if (!updatedSubCategory) {
      return res.status(400).json({
        msg: "Updating subcategory failed",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      msg: `Sub-Category updated to ${name}`,
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

//delete subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        msg: "Id is required",
        error: true,
        success: false,
      });
    }

    const deleteSubCategory = await SubCategoryModel.deleteOne({ _id: id });

    if (!deleteSubCategory) {
      return res.status(400).json({
        msg: "unable to delete sub category",
        error: true,
        success: false,
      });
    }

    if (deleteSubCategory.deletedCount >= 0) {
      return res.status(200).json({
        msg: "Subcategory removed!",
        success: true,
        error: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      success: false,
      error: true,
    });
  }
};
