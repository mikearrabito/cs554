const express = require("express");
const session = require("express-session");
const blogs = require("./data").blogs;
const app = express();
const PORT = 3000;

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
  })
);

app.use("/blog", async (req, res, next) => {
  if (req.url === "/login" || req.url === "/signup") {
    return next();
  }
  if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
    if (req.session?.AuthCookie?.user == null) {
      return res.status(401).json({ error: "Not authenticated" });
    }
  }
  next();
});

app.use("/blog/:id", async (req, res, next) => {
  if (req.method == "PUT" || req.method == "PATCH") {
    const blogId = req.params?.id;
    if (blogId == null) {
      return res.status(400).json({ error: "blogId invalid" });
    }
    const blog = await blogs.getBlogById(blogId);
    if (blog == null) {
      return res.status(400).json({ error: "Blog not found" });
    }
    if (blog.userThatPosted?._id !== req.session.AuthCookie.user._id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
  }
  next();
});

app.use("/blog/:id/comments", (req, res, next) => {
  if (req.method === "POST") {
    if (req.session?.AuthCookie?.user == null) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
  }
  next();
});

app.use("/blog/:blogId/:commentId ", async (req, res, next) => {
  if (req.method === "DELETE") {
    if (req.session?.AuthCookie?.user == null) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    if (req.params?.blogId == null || req.params?.commentId == null) {
      return res.status(400).json({ error: "Bad request" });
    }
    let commentFound = null;
    const blog = await blogs.getBlogById(req.params.blogId);
    for (const comment of blog.comments) {
      if (req.params.commentId === comment._id) {
        commentFound = comment;
        break;
      }
    }
    if (commentFound == null) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.userThatPostedComment._id !== req.session.AuthCookie.user._id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
  }
  next();
});

configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
