const blogRoutes = require("./blog");

const constructorMethod = (app) => {
  app.use("/blog", blogRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
