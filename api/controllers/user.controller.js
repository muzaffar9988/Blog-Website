import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import bcryptjs from "bcryptjs";

export function test(req, res) {
  res.json({ message: "api is working fine " });
}

export const updatedUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId)
    return next(errorHandler(401, "You are not allowed to Update profile"));

  if (req.body.password) {
    if (req.body.password.length < 7)
      return next(
        errorHandler(400, "password must be greater than 7 characters")
      );

    request.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7)
      return next(
        errorHandler(400, "username must be greater than 7 characters")
      );
    if (req.body.username.includes(" "))
      return next(errorHandler(400, "username cannot contain spaces"));
    if (req.body.username !== req.body.username.toLowerCase())
      return next(errorHandler(400, "username must be lower case"));
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "username must contain letters and numbers")
      );
    }
  }

  try {
    const updateProfile = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,

          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    if (!updateProfile)
      return next(errorHandler(400, "error in adding data to database"));
    console.log(updateProfile);
    res.status(200).json({
      message: "updated successfully",
      data: updateProfile,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId)
    return next(errorHandler(400, "you are not allowed to delete account"));

  try {
    const result = await User.findByIdAndDelete(req.params.userId);

    // if (!result) return next(errorHandler(400, "account is not deleted"));
    return res.status(200).json({ message: "account has been deleted" });
  } catch (error) {
    return next(errorHandler(400, "error in deleting account"));
  }
};

export const signout = async (req, res, next) => {
  try {
    const result = res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "cookie deleted" });

    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "You are not allowed to get post"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 9;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const userWithoutPassword = users.map((curr, ind) => {
      const { password, ...rest } = curr._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const date = new Date();
    const oneMonthAgo = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      date.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, "user not found"));
   
    const { password, ...rest } = user._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
