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
  })
);

configRoutes(app);

/*
You will apply a middleware that will be applied to the POST, PUT and PATCH routes for the /blog endpoint 
that will check if there is a logged in user, if there is not a user logged in, you will respond with the proper status code. 
For PUT and PATCH routes you also need to make sure the currently logged in user is the user who posted the blog post that is being updated.

You will apply a middleware that will be applied to the POST and DELETE routes for the /blog/:id/comments and 
/blog/:blogId/:commentId endpoints respectively that will check if there is a logged in user, if there is not a user logged in,
 you will respond with the proper status code. For the DELETE route, you also need to make sure the currently logged in user is 
 the user who posted the comment that is being deleted.
*/

app.use("/blog", async (req, res, next) => {
  if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
    if (req.session?.AuthCookie?.user == null) {
      res.status(401).json({ error: "Not authenticated" });
    }
  }
  if (req.method == "PUT" || req.method == "PATCH") {
    const blogId = req.params.id;
    if (blogId == null) {
      res.status(400);
    }
    let blog;
    try {
      blog = await blogs.getBlogById(blogId);
    } catch (e) {
      if (e.message === "Not found") {
        res.status(404).json({ error: "Blog not found" });
      } else {
        res.status(500).json({ error: "Server error retrieving blog" });
      }
    }
    if (blog.userThatPosted?._id !== req.session.AuthCookie.user.userid) {
      res.status(403).json({ error: "Unauthorized" });
    }
  }
  next();
});

app.use("/blog/:id/comments", (req, res, next) => {
  if (req.method === "POST") {
    if (req.session?.AuthCookie?.user == null) {
      res.status(401).json({ error: "Unauthenticated" });
    }
  }
  next();
});

app.use("/blog/:blogId/:commentId ", async (req, res, next) => {
  if (req.method === "DELETE") {
    if (req.session?.AuthCookie?.user == null) {
      res.status(401).json({ error: "Unauthenticated" });
    }
    if (req.params.blogId == null || req.params.commentId == null) {
      res.status(400);
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
      res.status(404).json({ error: "Comment not found" });
    }
    if (
      comment.userThatPostedComment?._id !== req.session.AuthCookie.user.userid
    ) {
      res.status(403).json({ error: "Unauthorized" });
    }
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
