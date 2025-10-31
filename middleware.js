module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl = req.originalUrl;
    console.log(req.session);
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  } else {
    console.log(req.user);
    next();
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// redirect URl ==>> jaise hum koi page per gye toh site ne login manga then woh page ki link redirectUrl name se session meh store krdiyae .(session yane jisme cookies v hai .) then login hone ke baaad .
//passport authenticate krega then post login req whi page per redirect krdega jha se login start huwa tha .
