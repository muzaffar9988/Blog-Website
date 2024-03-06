import errorHandler from "../utils/error.js";
import Comment from "../models/comment.model.js";
export const createComment = async (req, res, next) => {
  const { postId, content, userId } = req.body;
  if (userId !== req.user.id) {
    return next(errorHandler(401, "You are not allowed to comment"));
  }
  try {
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    const savedPost = await newComment.save();

    if (!savedPost) return next(errorHandler(401, "error in saving comment"));
    return res.status(200).json({
      data: savedPost,
      success: true,
      message: "data saved successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getPostComment = async (req, res, next) => {
  try {
    const postComment = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    if (!postComment) return next(errorHandler(401, "error in fetching api"));
    res.status(200).json(postComment);
  } catch (error) {
    next(error);
  }
};
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(401, "error is not found in "));

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes -= 1;
    }
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
