const { Comment, validateComment } = require("../models/commentModel");
const { Post } = require("../models/postModel");

class CommentsController {
  static async getCommentsOfPost(req, res) {
    const { postId } = req.params;
    let comments = await Comment.find({ postId }).populate(
      "userId",
      "firstName lastName avatar online"
    );
    res.send(comments);
  }

  static async create(req, res) {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { postId } = req.params;
    const { _id: userId } = req.user;

    let post = await Post.findOne({ _id: postId });
    if (!post) return res.status(204).send("Post not exist");

    let comment = new Comment({
      content: req.body.content,
      postId,
      userId,
    });

    await comment.save();
    comment = await Comment.findById(comment._id).populate(
      "userId",
      "firstName lastName online avatar"
    );
    res.send(comment);
  }

  static async update(req, res) {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { postId, commentId } = req.params;
    const { _id: userId } = req.user;

    let comment;
    try {
      comment = await Comment.findOneAndUpdate(
        { _id: commentId, postId, userId },
        { content: req.body.content }
      );
      if (!comment) return res.status(204).send("Comment not exist");
    } catch (err) {
      res.status(400).send("An unexpected error occurred.");
    }

    comment = await Comment.findOne({
      _id: commentId,
      postId,
      userId,
    }).populate("userId", "firstName lastName online avatar");
    res.send(comment);
  }

  static async delete(req, res) {
    const { _id: userId } = req.user;

    let comment = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      userId,
    });
    if (!comment) return res.status(204).send("Comment not exist");

    res.send(`comment ${req.params.commentId} deleted`);
  }
}

module.exports = CommentsController;
