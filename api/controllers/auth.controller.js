import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    )
      return next(errorHandler(500, "input field required"));
    //   res.status(500).json({
    //     success: false,
    //     message: "provide input fields",
    //   });

    const encryptedPassword = bcryptjs.hashSync(password, 10);
    console.log(encryptedPassword);

    if (!encryptedPassword)
      return res.status(500).json({ message: "error in encrypting password" });

    const user = new User({
      username,
      email,
      password: encryptedPassword,
    });

    const result = await user.save();

    return res.status(200).json({
      success: true,
      message: "signup successfully",
      data: result,
    });
  } catch (error) {
    // console.log("error in signup");
    // return res.status(500).json({
    //   success: false,
    //   message: "error in signup",
    //   error: error.message,
    // });
    return next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(404, "Input field required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(400, "Invalid user"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Invalid Password"));

    dotenv.config();
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);
  }
};
