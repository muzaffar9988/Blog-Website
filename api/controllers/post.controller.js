import errorHandler from "../utils/error.js";
import Post from "../models/post.model.js";
export const create = async (req, res, next) => {
  if (!req.body.isAdmin)
    return next(errorHandler(401, "you are not allowed to create a post"));
  if (!req.body.title || !req.body.content)
    return next(errorHandler(401, "all input fields are required"));

  // slug is used to make a website which is SEO friendly
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  try {
    const post = new Post({
      ...req.body,
      slug,
      userId: req.body.id,
    });
    console.log("before saving");
    const savedPost = await post.save();
    console.log("after saving");

    console.log(savedPost);
    return res.status(201).json({
      success: true,
      message: "post successfully created",
      data: savedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in creating post",
      error: error.message,
    });
  }
};
