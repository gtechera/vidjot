const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

//Load Idea Model
require("../models/Idea");
const Idea = mongoose.model("ideas");

//"Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas: ideas });
    });
});

//Add Idea Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//Edit Idea Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", { idea: idea });
    }
  });
});

//Process Form
router.post("/", ensureAuthenticated, (req, res) => {
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
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Video idea added");
      res.redirect("/ideas");
    });
  }
});

//Edit Form Process
router.put("/:id", ensureAuthenticated, (req, res) => {
  //update idea
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //Nuevos valores
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash("success_msg", "Video Idea Updated");
      res.redirect("/ideas");
    });
  });
});

//Delete Idea

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Video Idea Removed");
    res.redirect("/ideas");
  });
});

module.exports = router;
