const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("GET /api/blogs", () => {
  test("returns blogs as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("tests DB connection", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].title).toBe("Test2");
  });

  test("returns all blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("returns a specific blog", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain("Test2");
  });

  test("uses 'id' as the unique identifier of blog posts", async () => {
    const response = await api.get("/api/blogs");

    const blogIds = response.body.map((blog) => blog.id);
    expect(blogIds[0]).toBeDefined();
  });

  test("renders a specific blog by id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });
});

describe("POST /api/blogs", () => {
  let authToken;

  beforeAll(async () => {
    // Create a new user in the test database
    await User.deleteMany({});

    const newUser = {
      username: "testuser",
      password: "testpassword",
      name: "Test User",
    };

    await api.post("/api/users").send(newUser);

    // Log in the user to obtain the authentication token
    const loginCredentials = {
      username: newUser.username,
      password: newUser.password,
    };

    const response = await api.post("/api/login").send(loginCredentials);
    authToken = response.body.token;
  });

  test("adds a valid blog successfully", async () => {
    const newBlog = {
      title: "Test3",
      author: "Test3",
      url: "www.test.com",
      likes: 10,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((n) => n.title);

    expect(titles).toContain("Test3");
  });

  test("sets likes to 0 if missing", async () => {
    const newBlog = {
      title: "missingLikes",
      author: "miss",
      url: "www.miss.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const blogZeroLikes = blogsAtEnd.find(
      (blog) => blog.title === "missingLikes"
    );

    expect(blogZeroLikes.likes).toEqual(0);
  });

  test("returns 400 if required fields are missing", async () => {
    const newBlog = {
      url: "www.ako.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("DELETE /api/blogs", () => {
  test("deletes a blog successfully", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("PUT /api/blogs", () => {
  test("updates a blog successfully", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const blogId = blogToUpdate.id;

    await api
      .put(`/api/blogs/${blogId}`)
      .send({
        title: "updatedBlog",
        author: "updatedAuthor",
        url: "www.update.com",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const updatedBlogInDb = blogsAtEnd.find((n) => n.id === blogId);
    const updatedBlogTitle = updatedBlogInDb.title;

    expect(updatedBlogTitle).toContain("updatedBlog");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
