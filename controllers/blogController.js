require("express-async-errors");
const Blog = require("../models/blog");

const getBlogs = async (request, response) => {
  const blogs = await Blog.find({});
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
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
};

const deleteBlog = async (request, response) => {
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
