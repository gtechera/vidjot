const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

//Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Connect to mongose
mongoose
  .connect("mongodb://localhost/vidjot-dev")
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch(error => {
    console.log(error);
  });

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Method-override Middleware
app.use(methodOverride("_method"));

//Express-Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Connect-Flash Middleware
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Index Route
app.get("/", (req, res) => {
  const title = "Welcome to Vidjot";
  res.render("index", { title: title });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Use Routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
