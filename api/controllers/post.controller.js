import errorHandler from "../utils/error.js";
import Post from "../models/post.model.js";
export const create = async (req, res, next) => {
  console.log("create post re");
  console.log(req.body);
  console.log("request user", req.user);
  if (!req.user.isAdmin)
    return next(errorHandler(401, "you are not allowed to create a post"));
  if (!req.body.title || !req.body.content)
    return next(errorHandler(401, "all input fields are required"));

  // slug is used to make a website which is SEO friendly

  console.log("slug");
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

export const getposts = async (req, res, next) => {
  try {
    // we will check from where we have to start and convert it into integer
    const startIndex = parseInt(req.query.startIndex) || 0;
    console.log(startIndex);
    // set limit means how many post you want to show to user . if not given it will be 9
    const limit = parseInt(req.query.limit) || 9;
    // if order is asc then we will sort ascending wise else descending
    console.log(limit);
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    console.log(sortDirection);

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),

      ...(req.query.searchTerm && {
        //regex is used to search if anything that matches to search. in this case if search matches to title and content
        // or is used so that if search is present in title and content
        //options here means capital letter and small letter be treated as same

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
    console.log("reached after db call");
    const totalPosts = await Post.countDocuments();
    console.log(totalPosts);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    console.log(oneMonthAgo);
    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPost,
    });
  } catch (error) {
    console.log("unable to fetch data in post controller");
    next(error);
  }
};
export const deletepost = async (req, res, next) => {
  console.log("reached delete");
  if (!req.user.isAdmin || req.user.id !== req.params.userId)
    return next(errorHandler(401, "you are not allowed to delete the post"));
  console.log("reached before try");
  try {
    await Post.findByIdAndDelete(req.params.postId);
    console.log("reached after find by id");
    res
      .status(200)
      .json({ success: true, message: "post is successfully deleted" });
  } catch (error) {
    next(error);
  }
};
