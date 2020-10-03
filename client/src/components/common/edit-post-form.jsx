import React, { Component } from "react";
import postsService from "../../services/postsService";
import Swal from "sweetalert2";
import { swal, inputFileLabel } from "../../services/helpers";

class EditPostForm extends Component {
  state = {
    data: { content: "", images: [] },
    errors: {},
  };

  componentDidMount() {
    const { post } = this.props;
    this.setState({ data: { content: post.content, images: [] } });
  }

  handleChange = ({ name, value, files }) => {
    const data = { ...this.state.data };
    data[name] = value;
    if (files) data[name] = files;
    this.setState({ data });
  };

  doSubmit = async (e) => {
    e.preventDefault();
    const {
      post: { _id: postId },
    } = this.props;

    let { images, content } = this.state.data;
    let validForm = true;

    content = content.trim();
    if (content.length < 2 || content.length > 2500) {
      validForm = false;
      this.setState({
        errors: "content must be between 2 and 2500 characters",
      });
    }

    if (images.length > 5) {
      validForm = false;
      this.setState({
        errors: "You can upload up to 5 photos or file",
      });
    }

    if (validForm) {
      let formData = new FormData();

      if (images) {
        for (const image of images) {
          formData.append("images", image);
        }
      }

      formData.append("content", content);

      try {
        const { data: updatedPost } = await postsService.editPost(
          postId,
          formData
        );
        this.setState({ data: { content: "", images: [] }, errors: {} });
        Swal.fire(swal.update("Your post has been updated"));
        this.props.getUpdatedPost(updatedPost);
      } catch (err) {
        this.setState({
          errors: "Unauthorized format file or larger than 2 MB",
        });
      }
    }
  };

  render() {
    const {
      errors,
      data: { content, images },
    } = this.state;

    return (
      <form
        onSubmit={this.doSubmit}
        autoComplete="off"
        encType="multipart/form-data"
      >
        <h2 className="swal2-title">Edit post</h2>
        {errors.length && <div className="alert alert-danger">{errors}</div>}
        <div className="input-group">
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="edit-post-images"
              name="images"
              onChange={(e) => this.handleChange(e.currentTarget)}
              accept="image/png, image/jpeg, image/jpg, image/gif"
              multiple
            />
            <label
              className="custom-file-label text-muted"
              htmlFor="edit-post-images"
            >
              {inputFileLabel(images)}
            </label>
          </div>
        </div>

        <label htmlFor="edit-content-post" className="hide-label">
          Edit content post
        </label>
        <textarea
          className="input"
          name="content"
          id="edit-content-post"
          cols="40"
          rows="10"
          onChange={(e) => this.handleChange(e.currentTarget)}
          placeholder="Edit your content post here..."
          value={content}
        ></textarea>

        <div className="float-left">
          <button type="submit" className="button button-primary mr-2">
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default EditPostForm;
