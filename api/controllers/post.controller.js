import errorHandler from "../utils/error.js";
import Post from "../models/post.model.js";
export const create = async (req, res, next) => {
  console.log(req.body);

  if (!req.user.isAdmin)
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
      userId: req.user.id,
    });

    const savedPost = await post.save();

    return res.status(201).json({
      success: true,

      data: savedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

export const getposts = async (req, res, next) => {
  try {
    // we will check from where we have to start and convert it into integer
    const startIndex = parseInt(req.query.startIndex) || 0;

    // set limit means how many post you want to show to user . if not given it will be 9
    const limit = parseInt(req.query.limit) || 9;
    // if order is asc then we will sort ascending wise else descending

    const sortDirection = req.query.order === "asc" ? 1 : -1;
    //regex is used to search if anything that matches to search. in this case if search matches to title and content
    // or is used so that if search is present in title and content
    //options here means capital letter and small letter be treated as same

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          {
            title: { $regex: req.query.searchTerm, $options: "i" },
          },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPost,
    });
  } catch (error) {
    next(error);
  }
};
export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(errorHandler(401, "you are not allowed to delete the post"));

  try {
    await Post.findByIdAndDelete(req.params.postId);

    res
      .status(200)
      .json({ success: true, message: "post is successfully deleted" });
  } catch (error) {
    next(error);
  }
};
export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(errorHandler(401, "you are not allowed to update post"));

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: req.body.image,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
