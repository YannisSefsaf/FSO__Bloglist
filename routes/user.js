const userRouter = require("express").Router();

const { getUsers, createUser } = require("../controllers/userController");

userRouter.get("/", getUsers);

userRouter.post("/", createUser);

module.exports = userRouter;
