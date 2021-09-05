const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
const data = require("../data");
const blogs = data.blogs;
const users = data.users;

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
    return res.status(500).json({ error: e.message });
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
    return res.status(500).json({ error: e.message });
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

router.get("/", (req, res) => {
  const skip = req.query?.skip;
  const take = req.query?.take;
  // TODO finish
  res.json({ test: "test" });
});

router.get("/:id", (req, res) => {
  const id = req.params?.id;
  // TODO finish
  const blog = { blog: "test" };
  res.json(blog);
});

router.post("/", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
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
