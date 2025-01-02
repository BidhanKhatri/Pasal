import { Router } from "express";
import {
  forgetPasswordController,
  getUserDetailsController,
  loginController,
  logoutController,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
  updateUserDetails,
  uploadAvatarController,
  verifyEmailController,
  verifyOtpController,
} from "../controllers.js/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", authMiddleware, logoutController);
userRouter.put(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatarController
);
userRouter.put("/update-user", authMiddleware, updateUserDetails);
userRouter.put("/forgot-password", forgetPasswordController);
userRouter.put("/verify-otp", verifyOtpController);
userRouter.put("/reset-password", resetPasswordController);
userRouter.post("/refresh-token", refreshTokenController);
userRouter.get("/get-user-details", authMiddleware, getUserDetailsController);

export default userRouter;
