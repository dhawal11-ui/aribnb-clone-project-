const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { route } = require("./listing.js");

router.get("/", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/",
  WrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);
router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  async (req, res) => {
    res.send("wlscome back");
  }
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

module.exports = router;
