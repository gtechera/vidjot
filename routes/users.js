const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

//Load User Module
require("../models/User");
const User = mongoose.model("users");

//User Login Route
router.get("/login", (req, res) => {
  res.render("users/login");
});

//User Register Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Register Form POST
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Passwords can not be less than 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    //Let's check if there is another user with the same email
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "The email was already registered");
        res.redirect("/users/register");
      } else {
        //Hash Password
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            // Store hash in your password DB.
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;
