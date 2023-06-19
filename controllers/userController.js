require("express-async-errors");
const User = require("../models/user");
const bcrypt = require("bcrypt");
/* const Blog = require("../models/blog"); */

const getUsers = async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
  });

  response.json(users);
};

const createUser = async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || !username) {
    return response.status(400).json({
      error: "please provide both a username and a password",
    });
  }

  if (password.length < 4 || username.length < 4) {
    return response.status(400).json({
      error: "username or password needs to be at least 4 characters",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
};

module.exports = { getUsers, createUser };
