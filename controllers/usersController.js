const { User, validateUser } = require("../models/userModel");
const { Post } = require("../models/postModel");
const { Comment } = require("../models/commentModel");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("Joi");
const { mapUrlImage } = require("../middlewares/upload");

const validateUserLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(4).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const validateEditUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(255).required(),
    lastName: Joi.string().trim().min(2).max(255).required(),
    email: Joi.string().trim().min(4).max(255).required().email(),
    password: Joi.string().min(6).max(255),
    newPassword: Joi.string().min(6).max(255),
    about: Joi.string().trim().min(2).max(2500).allow(""),
  });

  return schema.validate(user);
};

// get the saved posts array
const getPostsArray = async (postsArray) => {
  let posts = await Post.find({ _id: { $in: postsArray } })
    .sort({ createdAt: -1 })
    .populate("userId", "firstName lastName avatar online");
  return posts;
};
class UsersController {
  static async register(req, res) {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email is taken");

    const { firstName, lastName, email, password } = req.body;

    user = new User({
      firstName,
      lastName,
      email,
      password,
      avatar: "uploads/default-user-avatar.webp",
    });
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    // return the new user without the password
    res.send(_.omit({ ...user._doc }, "password"));
  }

  static async login(req, res) {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or Password invalid.");

    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) return res.status(400).send("Email or Password invalid.");

    await User.findOneAndUpdate(
      { _id: user._id },
      { online: true, lastLogin: Date.now() }
    );
    res.send({ token: user.generateJwt() });
  }

  static async logout(req, res) {
    let user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { online: false }
    );
    if (!user) return res.status(204).send("User not found.");

    res.send({ message: `User ${user._id} logout` });
  }

  static async profile(req, res) {
    try {
      const user = await User.findById(req.params.userId).select("-password");
      if (!user) return res.status(400).send("User not found");
      res.send(user);
    } catch (err) {
      return res.status(400).send("User not found");
    }
  }

  static async getSavedPosts(req, res) {
    const { _id } = req.user;

    const user = await User.findOne({ _id });
    if (!user) return res.status(204).send("user not exist");
    const { savedPosts } = user;

    let getPosts = await getPostsArray(savedPosts);
    if (!getPosts) return res.status(400).send("There are no saved posts");

    res.send(getPosts);
  }

  static async savePost(req, res) {
    const savedPosts = req.body;
    if (savedPosts.length > 5)
      return res.status(400).send("You can't save more than 5 posts");
    await getPostsArray(savedPosts);

    const { _id } = req.user;

    let user = await User.findOneAndUpdate({ _id }, { savedPosts });
    user = await User.findById(_id);

    res.send(user);
  }

  static async edit(req, res) {
    const { error } = validateEditUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let { firstName, lastName, email, password, newPassword, about } = req.body;
    const { _id } = req.user;

    let user = await User.findOne({ _id }, { email: 1, password: 1 });
    if (!user) return res.status(204).send("User does not exist.");

    // if user wants change password && check password
    let changePassword = false;
    if (password && newPassword && password !== newPassword) {
      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass)
        return res.status(400).send("Current password does not match");
      newPassword = await bcrypt.hash(newPassword, 10);
      changePassword = true;
    }

    // check email unique
    if (user.email !== email) {
      user = await User.findOne({ email: email });
      if (user && user._id != _id)
        return res.status(400).send("Email is already in use");
    }

    // if user wants to change password
    if (changePassword) {
      user = await User.findOneAndUpdate(
        { _id },
        { firstName, lastName, email, password: newPassword, about }
      );
    } else {
      user = await User.findOneAndUpdate(
        { _id },
        { firstName, lastName, email, about }
      );
    }

    user = await User.findById(_id).select("-password");
    res.send(user);
  }

  static async updateAvatar(req, res) {
    const {
      file,
      user: { _id },
      params: { userId },
    } = req;

    if (_id != userId) return res.status(401).send("Access denied");
    let avatar;

    if (!file) avatar = "uploads/default-user-avatar.webp";
    else avatar = mapUrlImage(file);

    let user = await User.findOneAndUpdate({ _id }, { avatar });
    if (!user) return res.status(204).send("User not exist.");

    user = await User.findById(_id).select("-password");
    res.send(user);
  }

  static async delete(req, res) {
    const { _id: userId } = req.user;

    const postsLiked = await Post.find(
      { likes: { $in: [userId] } },
      { likes: 1 }
    );

    postsLiked.forEach(async ({ _id, likes }) => {
      if (likes.includes(userId)) {
        likes.splice(likes.indexOf(userId), 1);
        await Post.findByIdAndUpdate(_id, { likes });
      }
    });

    await Post.deleteMany({ userId });
    await Comment.deleteMany({ userId });
    await User.findOneAndDelete({ _id: userId });
    return res.send(`User ${userId} deleted`);
  }
}

module.exports = UsersController;
