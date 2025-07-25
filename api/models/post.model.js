import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://optinmonster.com/wp-content/uploads/2015/04/typesofblogposts.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: "String",
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = new mongoose.model("Post", postSchema);
export default Post;
