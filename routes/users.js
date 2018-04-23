const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../helpers/auth");
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

// Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
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

//Logout User
router.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// //User Profile Route
// router.get("/:id", ensureAuthenticated, (req, res) => {
//   User.findOne({
//     email: req.params.email
//   })
//     .then(user => {
//       console.log(user);
//       if (user.email !== req.params.email) {
//         req.flash("error_msg", "No está autorizado");
//         res.redirect("/login");
//       } else {
//         res.render("users/profile", { user: user });
//       }
//     })
//     .catch(err => {
//       throw err;
//     });
// });

// //Update user profile Form POST
// router.put("/:id", ensureAuthenticated, (req, res) => {
//   let errors = [];
//   if (req.body.password !== req.body.password2) {
//     errors.push({ text: "Passwords do not match" });
//   }
//   if (req.body.password.length < 4) {
//     errors.push({ text: "Passwords can not be less than 4 characters" });
//   }
//   if (errors.length > 0) {
//     res.render("users/profile", {
//       errors: errors,
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       password2: req.body.password2
//     });
//   } else {
//     //Let's check if there is another user with the same email
//     User.findOne({ email: req.body.email }).then(user => {
//       if (user) {
//         //Hash Password
//         const newUser = new User({
//           name: req.body.name,
//           email: req.body.email,
//           password: req.body.password
//         });
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) {
//               throw err;
//             }
//             // Store hash in your password DB.
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash("success_msg", "Your profile has been updated");
//                 res.redirect("/ideas");
//               })
//               .catch(err => {
//                 console.log(err);
//                 return;
//               });
//           });
//         });
//       } else {
//         req.flash("error_msg", "The email was already registered");
//         res.redirect("/users/profile");
//       }
//     });
//   }
// });

module.exports = router;
