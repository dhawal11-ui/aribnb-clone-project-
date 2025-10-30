const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { route } = require("./listing.js");
const flash = require("connect-flash");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  WrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        // middleware of passport
        if (err) {
          next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
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
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/signup/login",
    successRedirect: "/listings",
  }),
  async (req, res) => {
    console.log("[auth] login successful, req.user:", req.user);
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      // passpoert middlwaere fail hua in case toh err ko next(err); tackl`e krega .//
      next(err);
    } else {
      req.flash("success", "You are logged oUt now ");
      res.redirect("/listings");
    }
  });
});

module.exports = router;
