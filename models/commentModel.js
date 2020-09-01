const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  content: { type: String, minlength: 1, maxlength: 2500, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  postId: { type: mongoose.Types.ObjectId, required: true, ref: "Post" },
});

const validateComment = (comment) => {
  const schema = Joi.object({
    content: Joi.string().trim().min(1).max(2500),
  });

  return schema.validate(comment);
};

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, validateComment };
