const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => prev + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  let maxLikes = 0;
  let favoritePost = null;

  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favoritePost = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      };
    }
  }

  return favoritePost;
};

const mostBlogs = (blogs) => {
  const blogCounts = {};
  let maxCount = 0;
  let topAuthor = "";

  for (const blog of blogs) {
    const author = blog.author;
    if (blogCounts[author]) {
      blogCounts[author]++;
    } else {
      blogCounts[author] = 1;
    }

    if (blogCounts[author] > maxCount) {
      maxCount = blogCounts[author];
      topAuthor = author;
    }
  }

  console.log("blogCounts", blogCounts);

  return {
    author: topAuthor,
    blogs: maxCount,
  };
};

const mostLikes = (blogs) => {
  const likesByAuthor = {};

  for (const blog of blogs) {
    const author = blog.author;
    const likes = blog.likes;

    if (likesByAuthor[author]) {
      likesByAuthor[author] += likes;
    } else {
      likesByAuthor[author] = likes;
    }
  }

  let topAuthor = null;
  let maxLikes = 0;

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > maxLikes) {
      topAuthor = author;
      maxLikes = likesByAuthor[author];
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
