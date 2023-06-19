const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const login = async (request, response) => {
  // get username & password from req body
  const { username, password } = request.body;

  // get user from DB
  const user = await User.findOne({ username });

  // check if password is correct using bcrypt.compare formula and store boolean result in variable
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    // execution stops if there's no user OR if the password is incorrect
    // 401 status is sent as well as error message
    return response.status(401).json({
      error: "Invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token is issued using userForToken variable and secret string
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
};

module.exports = { login };
