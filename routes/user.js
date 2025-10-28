const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { route } = require("./listing.js");
const flash = require("connect-flash");
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

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/signup/login" }),
  async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

module.exports = router;
