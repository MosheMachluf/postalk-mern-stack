import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import PageHeader from "../common/page-header";
import MiniProfile from "../common/mini-profile";
import MainSearch from "../common/main-search";
import CreatePost from "../common/create-post";
import PostsList from "../common/posts-list";

import postsService from "../../services/postsService";
import { swal } from "../../services/helpers";
import authService from "../../services/authService";
import userService from "../../services/userService";
import EditPostForm from "../common/edit-post-form";

class Home extends Component {
  state = {
    user: null,
    posts: null,
    savedPosts: [],
    search: { value: "", error: "" },
    titleShow: null
  };

  allPosts = null;

  async componentDidMount() {
    const currentUser = authService.getCurrentUser();

    if (currentUser) {
      const { data: user } = await userService.details(currentUser._id);
      this.setState({ user, savedPosts: user.savedPosts });
    } else {
      this.setState({ user: {} });
    }

    try {
      const { data: posts } = await postsService.getAllPosts();
      this.allPosts = posts;
      this.setState({ posts });
    } catch (err) {
      this.setState({ posts: [] });
    }
  }
  
  newPost = (post) => {
    const posts = [...this.state.posts];
    posts.unshift(post);
    this.setState({ posts });
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

    if (result.value)
      Swal.fire(swal.update("Your post has been updated"));
    
  };

  deletePost = async (postId) => {
    const result = await Swal.fire(swal.delete("post"));
    if (result.value) {
      let { posts } = this.state;
      posts = posts.filter((post) => post._id !== postId);
      this.setState({ posts });
      await postsService.deletePost(postId);
      toast.error("Post deleted");
    }
  };

  savePost = async (post) => {
    const { savedPosts } = this.state;
    let add;

    if (savedPosts.includes(post._id)) {
      savedPosts.splice(savedPosts.indexOf(post._id), 1);
      add = false;
    } else {
      if (savedPosts.length >= 5)
        return toast.error("You can't save more than 5 posts");
      savedPosts.push(post._id);
      add = true;
    }

    this.setState({ savedPosts });

    await postsService.savePost(savedPosts);
    if (add) toast.success("Post saved successfully");
    else toast.error("Post remove from saved");
  };

  /* Search Posts */
  showPostsImages = async (withImages) => {
    try {
      const { data: posts } = await postsService.search("", withImages);
      this.setState({ posts, titleShow: `Show Posts With ${withImages ? "images" : "text"}` });
    } catch (err) {
      this.setState({ posts: [], titleShow: `No found posts Posts With ${withImages ? "images" : "text"}` });
    }
  };

  handleChangeSearch = ({ currentTarget: input }) => {
    this.setState({ search: { ...this.state.search, value: input.value }});
  };

  resetSearch = () => {
    const posts = (this.allPosts?.length && this.allPosts) || [];
    this.setState({ posts, search: { value: "" }, titleShow: null });
  };

  doSubmitSearch = async (e) => {
    e.preventDefault();
    const { value } = this.state.search;

    if (!value.trim()) return this.setState({ posts: this.allPosts, titleShow: null });

    try {
      const { data: posts } = await postsService.search(value, "");
      this.setState({ posts, titleShow: `Show ${posts.length} Results for: ${value}` });
    } catch (err) {
      this.setState({posts: [], search: { value: "", error: err.response.data }, titleShow: `Show 0 Results For: ${value}` });
    }
  };

  renderPosts(posts, savedPosts) {
    return (
      <div className="flex">
        <div className="grow-1">
          <PostsList
            posts={posts}
            message={this.state.search.error || null}
            text={
              this.state.search.error
                ? null
                : "You can be the first user who publish post here!"
            }
            savedPosts={savedPosts}
            savePost={this.savePost}
            editPost={this.editPost}
            deletePost={this.deletePost}
          />
        </div>
      </div>
    );
  }

  render() {
    const { user, posts, savedPosts, search, titleShow } = this.state;

    return (
      <>
        <PageHeader title="Home" />
        <div className="inner">
          <MiniProfile user={user} />

          {user && Object.keys(user).length > 0 && !user.about && (
            <div className="alert alert-info">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span>&times;</span>
              </button>

              <h4 className="alert-heading capitalize">Hey {user.firstName}</h4>
              <hr />
              <Link to="/account/settings">
                <p className="text-dark">
                  You are missing some profile details, Click here to complete
                  the profile details
                </p>
              </Link>
            </div>
          )}
          <hr />

          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <a
                className="nav-item nav-link active"
                id="nav-search-tab"
                data-toggle="tab"
                href="#nav-search"
                role="tab"
              >
                Search
              </a>
              {user && Object.keys(user).length ? (
                <a
                  className="nav-item nav-link"
                  id="nav-post-tab"
                  data-toggle="tab"
                  href="#nav-post"
                  role="tab"
                  aria-controls="nav-post"
                  aria-selected="true"
                >
                  Create Post
                </a>
              ) : null}
            </div>
          </nav>

          <div className="tab-content mb-5" id="nav-tabContent">
            <div className="tab-pane fade show active" id="nav-search">
              <MainSearch
                value={search.value}
                handleChange={this.handleChangeSearch}
                showPostsImages={this.showPostsImages}
                resetSearch={this.resetSearch}
                doSubmit={this.doSubmitSearch}
              />
            </div>
            <div className="tab-pane fade tac" id="nav-post">
              <CreatePost newPost={this.newPost} />
            </div>
          </div>

          {titleShow &&
          <div className="row">
            <div className="col-12 capitalize center my-2">
              <h4>{titleShow}</h4>
              <button className="btn text-primary" onClick={this.resetSearch}>Reset</button>
            </div>
          </div>}

          {this.renderPosts(posts, savedPosts)}
        </div>
      </>
    );
  }
}

export default Home;
