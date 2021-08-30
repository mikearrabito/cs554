const express = require("express");
const app = express();
const PORT = 3000;

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
