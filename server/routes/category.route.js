import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import upload from "../middlewares/multer.middleware.js";

const categoryRouter = Router();

categoryRouter.post(
  "/add-category",
  authMiddleware,
  upload.single("image"),
  addCategoryController
);
categoryRouter.get(
  "/get-all-category",
  authMiddleware,
  getAllCategoryController
);
categoryRouter.put(
  "/update-category",
  authMiddleware,
  upload.single("image"),
  updateCategoryController
);
categoryRouter.delete(
  "/delete-category",
  authMiddleware,
  deleteCategoryController
);

export default categoryRouter;
