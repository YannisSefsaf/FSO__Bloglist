const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Test2",
    author: "Test2",
    url: "www.test.com",
    likes: 10,
  },
  {
    title: "Test3",
    author: "Test3",
    url: "www.test.com",
    likes: 50,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
