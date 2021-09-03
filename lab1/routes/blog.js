const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
const data = require("../data");

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

router.post("/signup", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

router.post("/login", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

router.get("/logout", (req, res) => {
  // TODO finish
  res.json({ test: "test" });
});

module.exports = router;
