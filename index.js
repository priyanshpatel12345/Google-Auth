const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth_routers");
const userRouter = require("./routers/user_router");
const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MOngoDb");
  })
  .catch((error) => {
    console.log(error);
  });

// const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.use("/api/user", authRouter);

app.use("/api/auth", userRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
