import React, { Component } from "react";
import { toast } from "react-toastify";
import commentsService from "../../services/commentsService";
import Button from "./button";

class CreateComment extends Component {
  state = { data: { content: "" }, errors: {} };

  doSubmit = async (e) => {
    e.preventDefault();
    const { data } = this.state;

    if (!data.content.trim()) return;

    try {
      let { data: newComment } = await commentsService.createComment(
        this.props.postId,
        data
      );
      this.props.newComment(newComment);
      toast.success("Created New Comment");
      this.setState({ data: { content: "" } });
    } catch (err) {
      this.setState({ errors: err.response.data });
    }
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ data: { content: input.value } });
  };

  render() {
    return (
      <form
        onSubmit={(e) => this.doSubmit(e)}
        autoComplete="off"
        className="p-3"
      >
        <div className="flex jcsb aic form-control pr-0">
          <div className="grow-1">
            <label htmlFor="content" className="hide-label">
              Write a comment
            </label>

            <input
              type="text"
              name="content"
              id="content"
              placeholder="Write a comment ..."
              onChange={this.handleChange}
              value={this.state.data.content}
            />
          </div>

          <Button classbtn="btn">
            <i className="fas fa-paper-plane" />
          </Button>
        </div>
      </form>
    );
  }
}

export default CreateComment;
