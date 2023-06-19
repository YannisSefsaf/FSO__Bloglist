const { MONGODB_URI } = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./routes/blog");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const {
  unknownEndpoint,
  errorHandler,
  requestLogger,
} = require("./utils/middleware");
const { info } = require("./utils/logger");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// ...

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    info("connected to MongoDB");
  })
  .catch((error) => {
    info("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/", indexRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
