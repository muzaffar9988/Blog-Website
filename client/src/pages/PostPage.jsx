import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchPosts = async () => {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          setError(true);
          return;
        } else {
          console.log(data.posts);
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      };
      fetchPosts();
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error.message);
    }
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setRecentPost(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl w-full">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post && post.image}
        alt={post && post.title}
      />

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm ">
        <div>{post && new Date(post.createdAt).toLocaleDateString()}</div>
        <div className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </div>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Posts</h1>
        <div className="flex flex-wrap justify-center gap-5 mt-5">
          {recentPost &&
            recentPost.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
