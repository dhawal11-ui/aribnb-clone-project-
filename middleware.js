module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //passport function

    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  } else {
    console.log(req.user);
    next();
  }
};
