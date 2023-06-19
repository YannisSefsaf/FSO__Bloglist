const blogRouter = require("express").Router();

const {
  createBlog,
  getBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogController");

blogRouter.get("/", getBlogs);

blogRouter.get("/:id", getBlog);

blogRouter.post("/", createBlog);

blogRouter.delete("/:id", deleteBlog);

blogRouter.put("/:id", updateBlog);

module.exports = blogRouter;
