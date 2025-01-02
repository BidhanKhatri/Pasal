import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]; // cookie is used for desktop and headers is used for mobile device

    if (!token) {
      return res.status(401).json({
        msg: "Authorization token is missing",
        success: false,
        error: true,
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return res.status(401).json({
        msg: "Unauthorized user",
        success: false,
        error: true,
      });
    }

    req.userId = decode.id;
    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Unauthorized user" || error.message || error,
      error: true,
      success: false,
    });
  }
};

export default authMiddleware;
