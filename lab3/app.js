const { urlencoded } = require("express");
const express = require("express");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");

const app = express();
const PORT = 3000;

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  extname: ".hbs",
});

app.engine("hbs", handlebarsInstance.engine);
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`);
});
