import React from "react";
import Post from "./post";
import Preloader from "./preloader";

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
      {!posts && <Preloader />}
      {posts && posts.length ? (
        posts.map((post) => (
          <Post
            post={post}
            key={post._id}
            savedPosts={savedPosts}
            savePost={savePost}
            editPost={editPost}
            deletePost={deletePost}
          />
        ))
      ) : (
        <div className="card p-4">
          <h4>{message || "No posts yet... "}</h4>
          {text ? <p>{text}</p> : null}
        </div>
      )}
    </>
  );
};

export default PostsList;
