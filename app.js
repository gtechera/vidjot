const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

//Connect to mongose
mongoose
  .connect("mongodb://localhost/vidjot-dev")
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(error => {
    console.log(error);
  });

//Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Index Route
app.get("/", (req, res) => {
  const title = "Welcome to Vidjot";
  res.render("index", { title: title });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Add Idea Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

//Process Form
app.post("/ideas", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push("Por favor ingrese un título");
  }
  if (!req.body.details) {
    errors.push("Por favor ingrese los detalles");
  }
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    res.send("passed");
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
