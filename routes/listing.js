const express = require("express");
const app = express();
const router = express.Router();
// path ki locatin parent direcrtory se hai isliye ../
const WrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body); //listing schmea joi wala, usme ham req.body ka data dale check krne ke like ki woh sahi hai ki hai
  if (error) {
    // listing schema do jagaha defined hai ek mongodb ke liye dusra mongo db ka data check krne ke liye thorugh joi ejs
    let errMsg = error.details.map((el) => el.message).join(","); // total msg ke array meh se ek ek msg seprate karega then add karega usko
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// new (upr isliye taki id ke taraha treat na ho /new {show route refrence})
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner"); // reviews ko populate krdia taki reviews ka data bhi aa jaye
    if (!listing) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

//create route
router.post(
  "/",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //passport meh reheti hai id stoered
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/:id",
  validateListing,
  isLoggedIn,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingData = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, listingData); // id and kya update krna hai (2 parameters mongodb ka code hai)
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
    console.log(deletedListing);
  })
);

//index route to display all listings
router.get(
  "/",
  WrapAsync(async (req, res) => {
    console.log("[listing] GET /listings handler start", new Date().toISOString());
    const start = Date.now();
    const allListings = await Listing.find({});
    console.log("[listing] Listing.find completed in", Date.now() - start, "ms");
    res.render("listings/index.ejs", { allListings });
  })
);

module.exports = router;
