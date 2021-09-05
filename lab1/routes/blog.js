const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
const data = require("../data");
const blogs = data.blogs;
const users = data.users;
const DEFAULT_NUM_BLOGS_TO_SHOW = 20;
const MAX_ALLOWED_BLOGS_TO_SHOW = 100;

router.post("/signup", async (req, res) => {
  const name = req.body?.name;
  const username = req.body?.username;
  const password = req.body?.password;
  if (name == null || username == null || password == null) {
    return res.status(400).json({ error: "Missing parameters to create user" });
  }
  if (
    typeof name !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Name, username, and password must be strings" });
  }
  if (name.trim() === "" || username.trim() === "" || password.trim() === "") {
    return res.status(400).json({
      error: "Name, username, and password cannot be whitespace only",
    });
  }
  if (await users.userNameExists(username)) {
    return res
      .status(409)
      .json({ error: "Account with this username already exists" });
  }
  try {
    const createdUser = await users.createUser(name, username, password);
    delete createdUser.password;
    return res.status(201).json(createdUser);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;
  if (username == null || password == null) {
    return res.status(400).json({ error: "Missing parameters to login" });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "Username and password must be strings" });
  }
  if (username.trim() === "" || password.trim() === "") {
    return res.status(400).json({
      error: "Username, and password cannot be whitespace only",
    });
  }
  try {
    const user = await users.getUser(username);
    if (user == null) {
      // username not found
      return res.status(401).json({ error: "Invalid username or password" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.AuthCookie = {
        user: {
          _id: user._id,
          username: user.username,
        },
      };
    } else {
      // incorrect password
      return res.status(401).json({ error: "Invalid username or password" });
    }

    delete user.password;
    return res.status(200).json(user);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  if (req.session?.AuthCookie?.user != null) {
    req.session.destroy();
    return res.status(200).json({ message: "Successfully logged out" });
  } else {
    return res.status(304).json(); // not logged in, nothing to do
  }
});

router.get("/", async (req, res) => {
  if (req.query?.skip && !/^\d+$/.test(req.query.skip)) {
    // regex checks for any non digit characters
    res.status(400).json({ error: "Skip must be a number" });
  }
  if (req.query?.take && !/^\d+$/.test(req.query.take)) {
    res.status(400).json({ error: "Take must be a number" });
  }

  const skip = req.query?.skip ? parseInt(req.query.skip) : 0; // where to start from in our array of blogs, defaults to 0 if not supplied
  let take = req.query?.take
    ? parseInt(req.query.take)
    : DEFAULT_NUM_BLOGS_TO_SHOW; // number of blogs to show (0-100), defaults to 20 if not supplied

  if (isNaN(skip) || isNaN(take)) {
    // parseInt will set skip or take to NaN if given null, undefined, or a string thats not a valid int, shouldn't hit this because of the regex check,
    // but just an added check in case of a missed edge case
    return res.status(400).json({ error: "Invalid parameters" });
  }

  if (take > MAX_ALLOWED_BLOGS_TO_SHOW) {
    // if given value greater than max, set to max allowed
    take = MAX_ALLOWED_BLOGS_TO_SHOW;
  }

  const allBlogs = await blogs.getAllBlogs();
  res.status(200).json(allBlogs.slice(skip, skip + take));
});

router.get("/:id", async (req, res) => {
  const id = req.params?.id;
  if (id == null || typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ message: "Bad request" });
  }
  try {
    const blog = await blogs.getBlogById(id);
    if (blog == null) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json(blog);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { title, body } = req.body;
  if (!req.session?.AuthCookie?.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  if (title == null || body == null) {
    return res
      .status(400)
      .json({ error: "Title and body required to make a blog post" });
  }
  if (typeof title !== "string" || typeof body !== "string") {
    return res.status(400).json({ error: "Title and body must be strings" });
  }
  if (title.trim() === "" || body.trim() === "") {
    return res
      .status(400)
      .json({ error: "Title and body must not be whitespace only" });
  }
  try {
    const blog = await blogs.createBlog(
      req.session.AuthCookie.user.username,
      title,
      body
    );
    return res.status(201).json(blog);
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

router.patch("/:id", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

router.post("/:id/comments", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

router.delete("/:blogId/:commentId", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

module.exports = router;
