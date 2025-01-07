import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import genereatedAccessToken from "../utils/generatedAccessToken.js";
import genereatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//user registration
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "name,email & password are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: `${email} already registered`,
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(payload);
    await newUser.save();

    //verify the email of the user

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Welcome to Pasal",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.status(200).json({
      msg: "User registered successfully",
      error: false,
      success: true,
      data: newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, success: false, error: true });
  }
}

//verify email
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid code", error: true, success: false });
    }

    const updateVerification = await UserModel.updateOne(
      { _id: code },
      { $set: { verify_email: true } },
      { new: true }
    );

    return res.status(200).json({
      msg: "Email verification done",
      error: false,
      success: true,
      data: updateVerification,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}

//user login controller

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Provide email and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "User is not registered",
        error: true,
        success: false,
      });
    }

    //checking if user is active or not

    if (user.status !== "Active") {
      return res.status(400).json({
        msg: "Contact to Admin to activate your account",
        error: true,
        success: false,
      });
    }

    //checking the user password for verification

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        msg: "Password is incorrect",
        error: true,
        success: false,
      });
    }

    //genrating access and refresh token
    const accesstoken = await genereatedAccessToken(user._id);
    const refreshtoken = await genereatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: { last_login_date: new Date() },
      },
      { new: true }
    );

    //sending access and refresh token using cokkie

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accesstoken, cookieOption);
    res.cookie("refreshToken", refreshtoken, cookieOption);

    return res.status(200).json({
      msg: "Login Successfully",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshtoken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}

//user logout controller

export async function logoutController(req, res) {
  try {
    const userid = req.userId; // coming from the middleware

    //removing the cookie

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(
      userid,
      {
        $set: { refresh_token: "" },
      },
      { new: true }
    );

    return res.json({
      msg: "Logout Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

//user upload user avatar
export async function uploadAvatarController(req, res) {
  try {
    const userId = req.userId; // auth middleware bata aako
    const image = req.file; //multer middleware bata aako
    // console.log("image", image);

    const uploadImage = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: uploadImage.url,
    });

    return res.status(200).json({
      msg: "Image upload successfully",
      error: false,
      success: true,
      data: {
        _id: userId,
        avatar: uploadImage.url,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || error, error: true, success: false });
  }
}

//user  update user details
export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId; // auth middleware bata ako
    const { name, email, password, mobile } = req.body;

    let hashedPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { name, email, password: hashedPassword, mobile } },
      { new: true }
    );
    return res.status(200).json({
      msg: "User updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", success: false, error: true });
  }
}

//forget password controller
export async function forgetPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Email not found",
        error: true,
        success: false,
      });
    }

    const otp = generatedOtp();
    const otpExpiry = new Date() + 60 * 60 * 1000; //1hrs

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(otpExpiry).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot Password OTP",
      html: forgotPasswordTemplate({ name: user.name, otp: otp }),
    });

    return res.status(200).json({
      msg: "Otp send successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

//verify otp controller
export async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Email not found",
        error: true,
        success: false,
      });
    }

    //check the otp expiry
    const currentTime = new Date().toISOString();
    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        msg: "OTP expired",
        error: true,
        success: false,
      });
    }

    //check if the otp is correct or not
    if (user.forgot_password_otp !== otp) {
      return res.status(401).json({
        msg: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: { forgot_password_otp: "", forgot_password_expiry: "" },
      },
      { new: true }
    );

    return res.status(200).json({
      msg: "OTP verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

//reset the password
export async function resetPasswordController(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        msg: "All fields are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Email is not found",
        success: false,
        error: true,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        msg: "Password and confirm password does not match",
        error: true,
        success: false,
      });
    }

    let hashedPassword = "";

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      user._id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      msg: "Password reset successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

//creating the new access token using the refresh token

export async function refreshTokenController(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        msg: ["Invalid token", "Unauthorized access"],
        success: false,
        error: true,
      });
    }

    const verifyRefreshToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    const userId = verifyRefreshToken.id;

    const newAccessToken = await genereatedAccessToken(userId);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", newAccessToken, cookieOption);

    return res.status(200).json({
      msg: "New access token generated successfully",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get the user details
export async function getUserDetailsController(req, res) {
  try {
    const userId = req.userId; // auth middleware bata aako

    const findUser = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    return res.status(200).json({
      msg: "User details fetched successfully",
      error: false,
      status: true,
      data: findUser,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      succe: false,
      error: true,
    });
  }
}
