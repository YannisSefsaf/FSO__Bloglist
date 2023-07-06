require("express-async-errors");
const Blog = require("../models/blog");
const User = require("../models/user");

const getBlogs = async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
};

const getBlog = async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
};

const createBlog = async (request, response) => {
  const { title, author, url, likes } = request.body;
  const userId = request.user?.id;
  if (!userId) {
    return response.status(401).json({ error: "please provide valid jwt" });
  }
  const user = await User.findById(userId);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await Blog.findById(savedBlog._id).populate("user", {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
};

const deleteBlog = async (request, response) => {
  const userId = request.user?.id;
  const blogId = request.params.id;
  const blog = await Blog.findById(blogId);

  if (!userId) {
    return response.status(401).json({ error: "please provide valid jwt" });
  }

  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  if (!(blog.user.toString() === userId)) {
    return response.status(403).json({ error: "Unauthorized access" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
};

const updateBlog = async (request, response) => {
  let { title, author, url, likes } = request.body;

  if (!likes) {
    likes = 0;
  }

  await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  response.json({ title, author, url, likes, id: request.params.id });
};

module.exports = { getBlogs, getBlog, createBlog, deleteBlog, updateBlog };
