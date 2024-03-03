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
