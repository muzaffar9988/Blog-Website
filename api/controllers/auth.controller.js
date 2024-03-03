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
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
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

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  if (!name || !email)
    res.status(500).json({
      success: false,
      message: "google name and email is not present",
    });
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      return res.cookie("access_token", token, { httpOnly: true }).json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const { password, ...rest } = newUser._doc;

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {}
};
