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
    return null; // Could throw error, but would return 500 status code from our endpoint when 404 is likely more appropriate for not finding a blog for this id
    // (even though the id isnt a valid objectid, but that is not a server error)
  }

  const blogs = await blogsCollection();
  const blogFound = await blogs.findOne({ _id: ObjectId(id) });

  if (blogFound == null) {
    return null;
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

  const userThatPosted = await getUser(username);
  userThatPosted._id = ObjectId(userThatPosted._id);
  delete userThatPosted.name;
  delete userThatPosted.password;

  title = title.trim();
  body = body.trim();

  const newBlog = {
    _id: new ObjectId(),
    title,
    body,
    userThatPosted,
    comments: [],
  };

  const blogs = await blogsCollection();
  const insertInfo = await blogs.insertOne(newBlog);

  if (insertInfo.insertedCount === 0) {
    throw new Error("Could not create blog");
  }

  newBlog._id = newBlog._id.toString();
  newBlog.userThatPosted._id = newBlog.userThatPosted._id.toString();
  return newBlog;
};

const updateBlog = async (id, title, body) => {
  if (id == null) {
    throw new Error("Missing blog id");
  }
  if (title == null && body == null) {
    throw new Error("Missing values to update blog");
  }
  if (title != null && typeof title !== "string") {
    throw new TypeError("Title must be a string");
  }
  if (body != null && typeof body !== "string") {
    throw new TypeError("Body must be a string");
  }
  if (title && title.trim() === "") {
    throw new Error("Title must be a non whitespace only string");
  }
  if (body && body.trim() === "") {
    throw new Error("Body must be a non whitespace only string");
  }

  const currentBlog = await getBlogById(id);
  if (currentBlog == null) {
    throw new Error("Could not find blog to update");
  }

  const updatedBlog = {
    ...currentBlog,
    title: title == null ? currentBlog.title : title.trim(),
    body: body == null ? currentBlog.body : body.trim(),
  };
  delete updatedBlog._id; // cannot be present or mongodb throws an error for immutable field inside our update object

  const blogs = await blogsCollection();
  const updatedInfo = await blogs.updateOne(
    {
      _id: ObjectId(id),
    },
    {
      $set: updatedBlog,
    }
  );

  if (updatedInfo.modifiedCount === 0) {
    return null;
  }

  return await getBlogById(id);
};

const createComment = async (blogId, username, comment) => {
  if (blogId == null || username == null || comment == null) {
    throw new Error("Missing parameter(s)");
  }
  if (
    typeof blogId !== "string" ||
    typeof username !== "string" ||
    typeof comment !== "string"
  ) {
    throw new TypeError("blogId, username, comment must be strings");
  }
  if (blogId.trim() === "" || username.trim() === "" || comment.trim() === "") {
    throw new Error("Missing parameter(s)");
  }

  const userThatPostedComment = await getUser(username);
  userThatPostedComment._id = ObjectId(userThatPostedComment._id);
  delete userThatPostedComment.name;
  delete userThatPostedComment.password;

  const newComment = {
    _id: new ObjectId(),
    userThatPostedComment,
    comment: comment.trim(),
  };

  const blogs = await blogsCollection();

  const updateInfo = await blogs.updateOne(
    { _id: ObjectId(blogId) },
    { $push: { comments: newComment } }
  );

  return await getBlogById(blogId);
};

const deleteComment = async (blogId, commentId) => {
  if (blogId == null || commentId == null) {
    throw new Error("Missing parameter(s)");
  }
  if (typeof blogId !== "string" || typeof commentId !== "string") {
    throw new TypeError("blogId and commentId must be strings");
  }
  if (blogId.trim() === "" || commentId.trim() === "") {
    throw new Error("Missing parameter(s)");
  }

  const blogs = await blogsCollection();

  const updateInfo = await blogs.updateOne(
    { _id: ObjectId(blogId) },
    { $pull: { comments: { _id: ObjectId(commentId) } } }
  );

  return await getBlogById(blogId);
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  createComment,
  deleteComment,
};
