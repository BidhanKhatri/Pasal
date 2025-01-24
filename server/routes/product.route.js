import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  getAllProductController,
  getProudctByCategory,
  productController,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post(
  "/add-product",
  authMiddleware,
  upload.array("images"),
  productController
);
productRouter.post("/get-product", authMiddleware, getAllProductController);
productRouter.post("/get-product-by-category", getProudctByCategory);

export default productRouter;
