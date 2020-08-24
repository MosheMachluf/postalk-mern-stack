import React from "react";
import Avatar from "./avatar";
import { dateFormat } from "../../services/helpers";

const Comment = ({ comment, user, deleteComment, editComment }) => {
  return (
    <div className="bg-white my-3 p-3 border-bottom">
      <div className="flex">
        <div className="grow-1">
          <Avatar user={comment.userId} />
        </div>

        {user && user._id === comment.userId._id && (
          <div>
            <button className="btn p-0" data-toggle="dropdown">
              <div className="icon-padding">
                <i className="fas fa-ellipsis-h" />
              </div>
            </button>

            <ul className="dropdown-menu dropdown-menu-right">
              <li>
                <button className="btn btn-sm" onClick={editComment}>
                  <i className="fas fa-pencil-alt" />
                  Edit
                </button>
              </li>
              <li>
                <button
                  className="btn btn-sm text-danger"
                  onClick={deleteComment}
                >
                  <i className="far fa-trash-alt" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="bg-light rounded p-2 my-3 text-justify white-space-pre">
        {comment.content}
      </div>

      <small> {dateFormat(comment.createdAt)} </small>
    </div>
  );
};

export default Comment;
