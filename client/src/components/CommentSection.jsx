import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      if (res.ok) {
        setComment("");
        setCommentError(null);
        const data = await res.json();
        console.log(data);
      } else {
        console.log("error in posting api");
      }
    } catch (error) {
      setCommentError(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto  w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500">
          <p>signed in as: </p>
          <img
            src={currentUser.profilePicture}
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
            {commentError && <Alert color="failure"></Alert>}
          </div>
        </form>
      )}
    </div>
  );
}
