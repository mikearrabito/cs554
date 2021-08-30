const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    res.json({ test: "test" });
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
