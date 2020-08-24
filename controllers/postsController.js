const { Post, validatePost } = require("../models/postModel");
const _ = require("lodash");
const { mapUrlImage } = require("../middlewares/upload");
const { Comment } = require("../models/commentModel");
const fs = require("fs");
const { User } = require("../models/userModel");

class PostsController {
  static async getAll(req, res) {
    // let limit = 10;
    // let { page } = req.query;
    // let skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName online avatar");
    if (!posts.length) return res.status(400).send("There are no posts yet");
    res.send(posts);
  }

  static async getOne(req, res) {
    const post = await Post.findOne({ _id: req.params.postId });
    if (!post) return res.status(404).send("Post not exist");
    res.send(post);
  }

  static async getUserPosts(req, res) {
    const { userId } = req.params;

    try {
      const posts = await Post.find({ userId })
        .sort({ createdAt: -1 })
        .populate("userId", "firstName lastName avatar online");
      if (!posts) return res.status(404).send("There are no posts yet");

      res.send(posts);
    } catch (err) {
      return res.status(400).send("An unexpected error occurred");
    }
  }

  static async search(req, res) {
    const { q, images } = req.query;

    let posts = await Post.find({ content: { $regex: q } }).populate(
      "userId",
      "firstName lastName online avatar"
    );

    if (images === "true") {
      posts = posts.filter(
        ({ images, content }) => images.length > 0 && content.includes(q)
      );
    } else {
      posts = posts.filter(
        ({ images, content }) => !images.length && content.includes(q)
      );
    }

    if (!posts) return res.status(400).send("No results were found");

    res.send(posts);
  }

  static async create(req, res) {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      files,
      user: { _id: userId },
      body: { content },
    } = req;

    let post;
    if (!files) {
      post = new Post({
        content,
        userId,
      });
    } else {
      let images = mapUrlImage(files);

      post = new Post({
        content,
        images,
        userId,
      });
    }

    await post.save();
    post = await Post.findById(post._id).populate(
      "userId",
      "firstName lastName online avatar"
    );
    res.send(post);
  }

  static async update(req, res) {
    const {
      user: { _id: userId },
      params: { postId: _id },
      body: { content },
      files,
    } = req;

    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newValues;
    if (files.length) {
      const images = mapUrlImage(files);
      newValues = { content, images, lastUpdated: Date.now() };
    } else {
      newValues = { content, lastUpdated: Date.now() };
    }

    let post = await Post.findOneAndUpdate({ _id, userId }, newValues);

    post = await Post.findOne({ _id, userId }).populate(
      "userId",
      "firstName lastName online avatar"
    );
    res.send(post);
  }

  static async likes(req, res) {
    const { postId } = req.params;
    const { _id: userId } = req.user;

    let post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post not exist");

    let { likes } = post;

    if (likes.includes(userId)) likes.splice(likes.indexOf(userId), 1);
    else likes.push(userId);

    post = await post.save();

    post = await Post.findById(post._id);
    res.send(post);
  }

  static async delete(req, res) {
    const { postId } = req.params;

    // Checking users who saved this post
    const usersSavedPost = await User.find(
      { savedPosts: { $in: [postId] } },
      { savedPosts: 1 }
    );
    console.log(usersSavedPost);

    usersSavedPost.forEach(async ({ _id, savedPosts }) => {
      if (savedPosts.includes(postId)) {
        savedPosts.splice(savedPosts.indexOf(postId), 1);
        await User.findByIdAndUpdate(_id, { savedPosts });
      }
    });

    let post = await Post.findOneAndDelete({
      _id: req.params.postId,
      userId: req.user._id,
    });
    if (!post) return res.status(404).send("Post not exist");

    //delete the post images from server
    post.images.forEach((image) => fs.unlinkSync(image));

    await Comment.deleteMany({ postId });
    res.send({ message: `Post ${post._id} deleted`, post });
  }
}

module.exports = PostsController;
