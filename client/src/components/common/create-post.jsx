import React, { Component } from "react";
import postsService from "../../services/postsService";
import { toast } from "react-toastify";
import { inputFileLabel } from "../../services/helpers";

class CreatePost extends Component {
  state = {
    data: { content: "", images: [] },
    errors: {},
  };

  doSubmit = async (e) => {
    e.preventDefault();

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
        const { data: newPost } = await postsService.createPost(formData);
        toast.success("Created New Post");
        this.props.newPost(newPost);
        this.setState({ data: { content: "", images: [] }, errors: {} });
      } catch (err) {
        this.setState({
          errors: "Unauthorized format file or larger than 2 MB",
        });
      }
    }
  };

  handleChange = ({ name, value, files }) => {
    const data = { ...this.state.data };
    data[name] = value;
    if (files) data[name] = files;
    this.setState({ data });
  };

  render() {
    const { errors, data } = this.state;

    return (
      <div className="block-tabs py-5 px-2">
        <h3>Create Post</h3>

        <form
          onSubmit={this.doSubmit}
          autoComplete="off"
          className="col-lg-8 mx-auto text-left"
          encType="multipart/form-data"
        >
          {errors.length && <div className="alert alert-danger">{errors}</div>}
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="post-images"
                name="images"
                onChange={(e) => this.handleChange(e.currentTarget)}
                accept="image/png, image/jpeg, image/jpg, image/gif"
                multiple
              />
              <label
                className="custom-file-label text-muted"
                htmlFor="post-images"
              >
                {inputFileLabel(data.images)}
              </label>
            </div>
          </div>

          <label htmlFor="content-post" className="hide-label">
            Content
          </label>
          <textarea
            className="input"
            name="content"
            id="content-post"
            rows="5"
            onChange={(e) => this.handleChange(e.currentTarget)}
            placeholder="Write your post here..."
            value={data.content}
          ></textarea>
          <button type="submit" className="button button-primary">
            Add
          </button>
        </form>
      </div>
    );
  }
}

export default CreatePost;
