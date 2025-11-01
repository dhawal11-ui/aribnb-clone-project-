const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, ReviewSchema } = require("./schema.js");

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
    // session already has redirect url we are jsutt assigning it to locals to make it safe from passport reset feature.
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of this listingz");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body); //listing schmea joi wala, usme ham req.body ka data dale check krne ke like ki woh sahi hai ki hai
  if (error) {
    // listing schema do jagaha defined hai ek mongodb ke liye dusra mongo db ka data check krne ke liye thorugh joi ejs
    let errMsg = error.details.map((el) => el.message).join(","); // total msg ke array meh se ek ek msg seprate karega then add karega usko
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// validate review middleware (Joi)
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
