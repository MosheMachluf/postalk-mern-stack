const express = require("express");
const app = express();
const path = require("path");
require("./config/db");

const usersRoute = require("./routes/usersRoute");
const postsRoute = require("./routes/postsRoute");
const commentsRoute = require("./routes/commentsRoute");

/** MIDDLEWARS **/
if (process.env.NODE_ENV !== "production") {
  const cors = require("cors");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/account", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/comments", commentsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to PostTalk Server");
});

app.use((req, res, next) => {
  res.status(404).send("404 Page Not Found!");
});

/** SERVER **/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
