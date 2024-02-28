// const express = require("express");

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("db connected successfully"))
  .catch((error) => {
    console.log(error);
    console.log("error in connecting db");
  });

const app = express();

app.listen(3000, () => {
  console.log("app is listening on port ", 3000);
});

app.use("/api/user", userRoutes);
