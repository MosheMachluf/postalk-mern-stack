const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  content: { type: String, minlength: 2, maxlength: 2500, required: true },
  images: Object,
  lastUpdated: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  likes: Array,
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

const validatePost = (post) => {
  const schema = Joi.object({
    content: Joi.string().trim().min(2).max(2500).required(),
    images: Joi.array().max(5),
  });

  return schema.validate(post);
};

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, validatePost };
