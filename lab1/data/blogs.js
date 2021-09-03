const mongoCollections = require("../config/mongoCollections");
const ObjectId = require("mongodb").ObjectId;
const blogsCollection = mongoCollections.blogs;
const { getUser } = require("./users");

const getAllBlogs = async () => {
  const blogs = await blogsCollection();
  const blogsFound = await blogs.find({}).toArray();
  for (const blogFound of blogsFound) {
    blogFound._id = blogFound._id.toString();
    blogFound.userThatPosted._id = blogFound.userThatPosted._id.toString();
    for (const comment of blogFound.comments) {
      comment._id = comment._id.toString();
      comment.userThatPostedComment._id =
        comment.userThatPostedComment._id.toString();
    }
  }
  return blogsFound;
};

const getBlogById = async (id) => {
  if (!id || typeof id !== "string" || id.trim() === "") {
    throw new Error("Id must be a string");
  }
  if (!ObjectId.isValid(id)) {
    throw new Error("Id is not a valid ObjectId");
  }

  const blogs = await blogsCollection();
  const blogFound = await blogs.find({ _id: ObjectId(id) });

  if (blogFound == null) {
    throw new Error("Not found");
  }

  blogFound._id = blogFound._id.toString();
  blogFound.userThatPosted._id = blogFound.userThatPosted._id.toString();
  for (const comment of blogFound.comments) {
    comment._id = comment._id.toString();
    comment.userThatPostedComment._id =
      comment.userThatPostedComment._id.toString();
  }
  return blogFound;
};

const createBlog = async (username, title, body) => {
  if (username == null || title == null || body == null) {
    // == null catches null or undefined
    throw new Error("Missing parameters to create blog");
  }
  if (
    typeof username !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string"
  ) {
    throw new TypeError("Unexpected type for a parameter found");
  }
  if (title.trim() === "" || body.trim() === "") {
    throw new Error("Title and body must not be empty");
  }

  const userThatPosted = getUser(username);
  userThatPosted._id = ObjectId(userThatPosted._id);
  delete userThatPosted.name;

  const newBlog = {
    _id: new ObjectId(),
    title,
    userThatPosted,
    comments: [],
  };

  const blogs = await blogsCollection();
  const insertInfo = blogs.insertOne(newBlog);

  if (insertInfo.insertedCount === 0) {
    throw new Error("Could not create blog");
  }

  newBlog._id = newBlog._id.toString();
  newBlog.userThatPosted._id = newBlog.userThatPosted._id.toString();
  return newBlog;
};

module.exports = { getAllBlogs, getBlogById, createBlog };
