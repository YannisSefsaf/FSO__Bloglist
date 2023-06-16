const blogRouter = require("express").Router();

const { createBlog, getBlogs } = require("../controllers/blogController");

blogRouter.get("/", getBlogs);

blogRouter.post("/", createBlog);

module.exports = blogRouter;
