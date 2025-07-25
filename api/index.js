// const express = require("express");

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import commentRoute from "./routes/comment.route.js";
import path from "path";
import { configDotenv } from "dotenv";
configDotenv();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("db connected successfully"))
  .catch((error) => {
    console.log(error);
    console.log("error in connecting db");
  });
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
  console.log("app is listening on port ", 3000);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server errror";
  return res.status(statusCode).json({
    statusCode,
    message,
    error,
  });
});
