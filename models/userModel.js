const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 255 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 255 },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  avatar: { type: String },
  about: { type: String, minlength: 2, maxlength: 2500 },
  online: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  savedPosts: Array,
});

// REGEX for pass must contain digit, speciel char, at least 8 char /^(?=.*[\w])(?=.*[\W])[\w\W]{8}$/
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(255).required(),
    lastName: Joi.string().trim().min(2).max(255).required(),
    email: Joi.string().trim().min(4).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
    confirmPassword: Joi.valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords don't match" }),
    isLogged: Joi.boolean(),
    lastLogin: Joi.string(),
    savedPosts: Joi.array().items(Joi.string()),
  });

  return schema.validate(user);
};

userSchema.methods.generateJwt = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      online: true,
    },
    process.env.SECRET_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser };
