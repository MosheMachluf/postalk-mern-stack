import React, { Component } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

import userService from "../../services/userService";
import authService from "../../services/authService";
import postsService from "../../services/postsService";
import { fullName, swal, dateFormat } from "../../services/helpers";

import Preloader from "../common/preloader";
import Button from "../common/button";
import PageHeader from "../common/page-header";

import Avatar from "../common/avatar";
import PostsList from "../common/posts-list";
import EditPostForm from "../common/edit-post-form";

class Profile extends Component {
  state = {
    user: null,
    userId: null,
    posts: null,
    savedPosts: null,
    savedPostsIds: null,
  };

  async getSavedPosts() {
    const { data: savedPosts } = await postsService.getSavedPosts();
    this.setState({ savedPosts });
  }

  async getUserProfile(userId, me) {
    if (me && me._id === userId) {
      this.getSavedPosts();
    }

    try {
      // get the details of user profile by params userId
      const { data: user } = await userService.details(userId);
      const { data: posts } = await postsService.getUserPosts(userId);
      this.setState({ user, posts, savedPostsIds: user.savedPosts });
    } catch (err) {
      this.setState({ user: {}, me: {}, posts: [] });
    }
  }

  async componentDidMount() {
    let { userId } = this.props.match.params;
    let me = authService.getCurrentUser();
    this.setState({ userId, me });

    this.getUserProfile(userId, me);
  }

  componentDidUpdate() {
    let { userId } = this.props.match.params;

    if (this.state.userId !== userId) {
      this.setState({ userId });
      this.getUserProfile(userId, this.state.me);
    }
  }

  savePost = async (post) => {
    let { savedPostsIds } = this.state;

    let add;

    if (savedPostsIds.includes(post._id)) {
      savedPostsIds.splice(savedPostsIds.indexOf(post._id), 1);
      add = false;
    } else {
      if (savedPostsIds.length >= 5)
        return toast.error("You can't save more than 5 posts");
      savedPostsIds.push(post._id);
      add = true;
    }

    this.setState({ savedPostsIds });
    await postsService.savePost(savedPostsIds);
    if (add) toast.success("Post saved successfully");
    else toast.error("Post remove from saved");

    this.getSavedPosts();
  };

  getUpdatedPost = (updatedPost) => {
    const posts = this.state.posts;
    let indexPost = posts.findIndex((post) => post._id === updatedPost._id);
    posts[indexPost] = updatedPost;
    this.setState({ posts });
  };

  editPost = async (post) => {
    const MySwal = withReactContent(Swal);
    const result = await MySwal.fire({
      html: <EditPostForm post={post} getUpdatedPost={this.getUpdatedPost} />,
      showConfirmButton: false,
      showCloseButton: true,
    });

    if (result.value) {
      Swal.fire(swal.update("Your post has been updated"));
    }
  };

  deletePost = async (postId) => {
    let result = await Swal.fire(swal.delete("post"));

    if (result.value) {
      let { posts } = this.state;
      posts = posts.filter((post) => post._id !== postId);
      this.setState({ posts });
      await postsService.deletePost(postId);
      toast.error("Post deleted");
    }
  };

  renderUserDetails(user, me) {
    return (
      (!user && <Preloader />) ||
      (Object.keys(user).length ? (
        <div className="card capitalize py-3">
          <div className="row">
            <div className="col-lg-5 center">
              {me && me._id === user._id ? (
                <div className="dropdown">
                  <button
                    className="dropdown-toggle btn hover-img"
                    type="button"
                    id="dropdownImgMenu"
                    data-toggle="dropdown"
                  >
                    <Avatar
                      user={user}
                      withName={false}
                      width="250px"
                      borderWhite
                    />
                  </button>

                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        this.viewPic(user.avatar, `${fullName(user)} avatar`)
                      }
                    >
                      View Picture
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={this.changeAvatar}
                    >
                      Change Picture
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => this.removePic(user._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn"
                  onClick={() => this.viewPic(user.avatar)}
                >
                  <Avatar
                    user={user}
                    withName={false}
                    width="250px"
                    borderWhite
                  />
                </button>
              )}
            </div>

            <div className="table-responsive col-lg-7 p-3">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td> {fullName(user)} </td>
                  </tr>

                  <tr>
                    <th>Email</th>
                    <td> {user.email} </td>
                  </tr>

                  <tr>
                    <th>Last Login</th>
                    <td> {dateFormat(user.lastLogin)} </td>
                  </tr>

                  <tr>
                    <th>Created at</th>
                    <td> {dateFormat(user.createdAt)} </td>
                  </tr>

                  {user.about && (
                    <tr>
                      <th>about</th>
                      <td className="white-space-pre"> {user.about} </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {me?._id === user?._id && (
                <div>
                  <Button to="/account/settings" classlink="button">
                    <i className="fas fa-pencil-alt" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm p-3 mb-3">
          <h1 className="text-danger"> 404 User Not Found </h1>
        </div>
      ))
    );
  }

  renderTabs(user, me, posts, savedPosts, savedPostsIds) {
    return user && Object.keys(user).length ? (
      <>
        <nav>
          <div className="nav nav-tabs" role="tablist">
            <a
              className="nav-item nav-link active"
              id="nav-my-posts-tab"
              data-toggle="tab"
              href="#nav-my-posts"
            >
              <i className="far fa-list-alt mr-2" />
              My Posts ({posts?.length})
            </a>

            {me?._id === user?._id && (
              <a
                className="nav-item nav-link"
                id="nav-saved-posts-tab"
                data-toggle="tab"
                href="#nav-saved-posts"
              >
                <i className="far fa-bookmark mr-2" />
                Saved Posts ({savedPosts?.length})
              </a>
            )}
          </div>
        </nav>

        <div className="tab-content mb-5">
          <div className="tab-pane fade show active" id="nav-my-posts">
            <PostsList
              posts={posts}
              message="There are no posts yet..."
              savedPosts={savedPostsIds}
              savePost={this.savePost}
              editPost={this.editPost}
              deletePost={this.deletePost}
            />
          </div>

          {me?._id === user?._id && (
            <div className="tab-pane fade" id="nav-saved-posts">
              <PostsList
                posts={savedPosts}
                message="You have not saved any posts"
                savedPosts={savedPostsIds}
                savePost={this.savePost}
                editPost={this.editPost}
                deletePost={this.deletePost}
              />
            </div>
          )}
        </div>
      </>
    ) : null;
  }

  viewPic = (avatar, alt) => {
    Swal.fire(swal.openImage(avatar, alt));
  };

  changeAvatar = async () => {
    const { value: file } = await Swal.fire({
      title: "Select image",
      text: "Choose file (Up to 2 MB, jpeg / jpg / png / gif)",
      input: "file",
      inputAttributes: {
        accept: "image/png, image/jpeg, image/jpg,image/gif",
        "aria-label": "Upload your profile picture",
      },
    });

    let { userId } = this.props.match.params;
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      try {
        await userService.changeAvatar(userId, formData);
        Swal.fire(
          swal.update("Your profile photo has been successfully updated!")
        );
        setTimeout(() => (window.location = "/"), 800);
      } catch (err) {
        Swal.fire(swal.error("Unauthorized format file or larger than 2 MB"));
      }
    }
  };

  removePic = async (userId) => {
    await userService.changeAvatar(userId);
    Swal.fire(swal.update("Your profile picture has been removed"));
    setTimeout(() => (window.location = "/"), 800);
  };

  render() {
    const { user, me, posts, savedPosts, savedPostsIds } = this.state;

    return (
      <>
        <PageHeader
          title={
            user && Object.keys(user).length ? fullName(user) : `User not found`
          }
        />

        <div className="inner">
          <Button to="/" classlink="button">
            <i className="fas fa-arrow-circle-left" /> Back
          </Button>

          {this.renderUserDetails(user, me)}
          {this.renderTabs(user, me, posts, savedPosts, savedPostsIds)}
        </div>
      </>
    );
  }
}

export default Profile;
