import React, { Component } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import ShowMoreText from "react-show-more-text";

import Avatar from "./avatar";
import Comment from "./comment";
import Loader from "./loader";
import CreateComment from "./create-comment";
import Button from "./button";

import commentsService from "../../services/commentsService";
import authService from "../../services/authService";
import postsService from "../../services/postsService";
import { swal, dateFormat, uploadsUrl } from "../../services/helpers";

class Post extends Component {
  state = { comments: null, user: null, likes: null };

  async componentDidMount() {
    const user = authService.getCurrentUser();
    const { data: comments } = await commentsService.getPostComments(
      this.props.post._id
    );

    this.setState({ comments, likes: this.props.post.likes, user });
  }

  /* Post */
  renderPostHeader(post, user) {
    return (
      <div className="post-header">
        <div className="grow-1">
          <Avatar user={post.userId} />
        </div>

        <small className="text-muted date px-4">
          {dateFormat(post.createdAt)}
        </small>

        {user && user._id === post.userId._id && (
          <>
            <button className="btn p-0" data-toggle="dropdown">
              <div className="icon-padding">
                <i className="fas fa-ellipsis-h" />
              </div>
            </button>

            <ul className="dropdown-menu dropdown-menu-right">
              <li>
                <button
                  className="btn btn-sm"
                  onClick={() => this.props.editPost(post)}
                >
                  <i className="fas fa-pencil-alt" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="btn btn-sm text-danger"
                  onClick={() => this.props.deletePost(post._id)}
                >
                  <i className="far fa-trash-alt" />
                  Delete
                </button>
              </li>
            </ul>
          </>
        )}
      </div>
    );
  }

  renderPostBody(post) {
    return (
      <div className="post-body">
        <div className="content">
          <ShowMoreText keepNewLines={true}>{post.content}</ShowMoreText>
        </div>

        {post.images.length > 0 && (
          <div className="post-images">
            {post.images.map((image) => (
              <figure>
                <img
                  src={uploadsUrl + image}
                  onClick={() =>
                    this.openImage(image, post.content.slice(0, 100))
                  }
                  alt={`${post.content.slice(0, 100)} post`}
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    );
  }

  renderPostFooter(post, comments, user, likes, savedPosts) {
    return (
      <div className="footer-post">
        <div className="flex">
          {user && (
            <Button
              type="button"
              classbtn={
                likes.includes(user._id)
                  ? "button button-primary small"
                  : "button small"
              }
              onClick={() => this.likePost(post._id)}
            >
              <i
                className={
                  likes.includes(user._id)
                    ? "fas fa-thumbs-up"
                    : "far fa-thumbs-up"
                }
              />
              {likes?.length} Like
            </Button>
          )}

          <Button
            type="button"
            classbtn={
              comments?.length
                ? "button button-primary small mx-1"
                : "button small mx-1"
            }
            data-toggle="collapse"
            href={`#collapseComments${post._id}`}
          >
            <i
              className={
                comments?.length ? "fas fa-comment-alt" : "far fa-comment-alt"
              }
            />
            {comments?.length} Comments
          </Button>

          {user && (
            <Button
              type="button"
              classbtn={
                savedPosts && savedPosts.includes(post._id)
                  ? "button button-primary small"
                  : "button small"
              }
              onClick={() => this.props.savePost(post)}
            >
              <i
                className={
                  savedPosts && savedPosts.includes(post._id)
                    ? "fas fa-bookmark"
                    : "far fa-bookmark"
                }
              />
              Save
            </Button>
          )}
        </div>
      </div>
    );
  }

  renderPostComments(comments, user, postId) {
    return (
      <>
        <div className="collapse" id={`collapseComments${postId}`}>
          {(!comments && <Loader />) ||
            (comments.length ? (
              comments.map((comment) => (
                <Comment
                  comment={comment}
                  key={comment._id}
                  user={user}
                  deleteComment={() =>
                    this.deleteComment(comment.postId, comment._id)
                  }
                  editComment={() =>
                    this.editComment(
                      comment.postId,
                      comment._id,
                      comment.content
                    )
                  }
                />
              ))
            ) : (
              <div className="p-4">
                <i>Not comments yet</i>
              </div>
            ))}
        </div>
        {/* <Button to="/" classlink="mx-5">
          Click to view all comments
        </Button> */}
      </>
    );
  }

  openImage(image, alt) {
    Swal.fire(swal.openImage(image, `${alt} post image`));
  }

  likePost = async (postId) => {
    try {
      const {
        data: { likes },
      } = await postsService.likePost(postId);
      this.setState({ likes });
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  /* Comments */
  newComment = (comment) => {
    let comments = [...this.state.comments];
    comments.push(comment);
    this.setState({ comments });
  };

  editComment = async (postId, commentId, content) => {
    const result = await Swal.fire({
      title: "Edit your comment here",
      input: "textarea",
      inputValue: content,
      inputPlaceholder: "Edit your comment here...",
      inputAttributes: {
        "aria-label": "Edit your comment here",
      },
      showCancelButton: true,
    });

    if (result.value && content !== result.value) {
      let { comments } = this.state;

      let { data: commentUpdated } = await commentsService.editComment(
        postId,
        commentId,
        {
          content: result.value,
        }
      );

      Swal.fire(swal.update("Your comment has been updated"));

      comments = comments.map((comment) =>
        comment._id === commentUpdated._id ? commentUpdated : comment
      );

      this.setState({ comments });
    }
  };

  deleteComment = async (postId, commentId) => {
    const { value } = await Swal.fire(swal.delete("comment"));

    if (value) {
      let { comments } = this.state;
      comments = comments.filter((comment) => comment._id !== commentId);
      this.setState({ comments });
      Swal.fire("Deleted!", "Your comment has been deleted.", "success");
      await commentsService.deleteComment(postId, commentId);
    }
  };

  render() {
    const { post, savedPosts } = this.props;
    const { comments, user, likes } = this.state;

    return (
      <>
        {comments && (
          <div className="post card">
            {this.renderPostHeader(post, user)}
            {this.renderPostBody(post)}
            {post.lastUpdated && (
              <small className="text-muted px-4 float-right">
                Last Updated: {dateFormat(post.lastUpdated)}
              </small>
            )}
            {this.renderPostFooter(post, comments, user, likes, savedPosts)}
            {this.renderPostComments(comments, user, post._id)}
            {user && (
              <CreateComment postId={post._id} newComment={this.newComment} />
            )}
          </div>
        )}
      </>
    );
  }
}

export default Post;
