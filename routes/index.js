const indexRouter = require("express").Router();

indexRouter.get("/", (req, res) => {
  res.redirect("/api/blogs");
});

module.exports = indexRouter;
