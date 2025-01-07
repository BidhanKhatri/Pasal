import { Router } from "express";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const subCategoryRouter = Router();

subCategoryRouter.post(
  "/add-subcategory",
  authMiddleware,
  upload.single("image"),
  addSubCategory
);

subCategoryRouter.get(
  "/get-all-subcategory",
  authMiddleware,
  getAllSubCategory
);

subCategoryRouter.put(
  "/update-subcategory",
  authMiddleware,
  upload.single("image"),
  updateSubCategory
);

subCategoryRouter.delete(
  "/delete-subcategory",
  authMiddleware,
  deleteSubCategory
);

export default subCategoryRouter;
