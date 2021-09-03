const mongoCollections = require("../config/mongoCollections");
const ObjectId = require("mongodb").ObjectId;
const usersCollection = mongoCollections.users;

const createUser = async (name, username, password) => {
  if (name == null || username == null || password == null) {
    throw new Error("Missing parameters to create user");
  }
  if (
    typeof name !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    throw new TypeError("Unexpected type for a parameter found");
  }
  if (name.trim() === "" || username.trim() === "" || password.trim() === "") {
    throw new Error("Name, username, and password must not be empty");
  }

  const newUser = {
    _id: new ObjectId(),
    name,
    username: username.toLowerCase(),
    password,
  };

  const users = await usersCollection();
  const insertInfo = users.insertOne(newUser);

  if (insertInfo.insertedCount === 0) {
    throw new Error("Could not create user");
  }

  delete newUser.password;
  newUser._id = newUser._id.toString();
  return newUser;
};

const getUser = async (username) => {
  if (username == null) {
    throw new Error("No username provided");
  }
  if (typeof username !== "string") {
    throw new TypeError("Username must be a string");
  }
  if (username.trim() === "") {
    throw new Error("Invalid username");
  }

  const users = await usersCollection();
  const userFound = users.find({ username: username.toLowerCase() });

  if (userFound == null) {
    throw new Error("Not found");
  }

  delete userFound.password;
  userFound._id = userFound._id.toString();
  return userFound;
};

module.exports = { createUser, getUser };
