const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.sendFile("public/index.html");
});

app.use("*", (req, res) => {
  return res.status(404).json({ error: "404" });
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
