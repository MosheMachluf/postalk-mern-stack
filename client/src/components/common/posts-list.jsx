import React from "react";
import Post from "./post";
import Loader from "./loader";

const PostsList = ({
  posts,
  message,
  text,
  savedPosts,
  savePost,
  editPost,
  deletePost,
}) => {
  return (
    <>
      {!posts && <Loader />}
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <Post
            post={post}
            key={post._id}
            savedPosts={savedPosts}
            savePost={savePost}
            editPost={editPost}
            deletePost={deletePost}
          />
        ))}
      {posts && !posts.length && (
        <div className="card p-4">
          <h4>{message || "No posts yet... "}</h4>
          {text ? <p>{text}</p> : null}
        </div>
      )}
    </>
  );
};

export default PostsList;
