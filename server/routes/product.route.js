import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { productController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post(
  "/add-product",
  authMiddleware,
  upload.array("images"),
  productController
);

export default productRouter;
