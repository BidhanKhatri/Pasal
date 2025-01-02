import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/dbconfig.js";
import userRouter from "./routes/user.route.js";

const app = express();
dotenv.config();

//middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//routes
app.use("/api/user", userRouter);

const PORT = 8080 || process.env.PORT;

//MongoDB connection with express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
});
