const express = require("express");
const app = express();
const router = express.Router();
// path ki locatin parent direcrtory se hai isliye ../
const WrapAsync = require("../utils/WrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

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
    newListing.owner = req.user._id; //passport meh reheti hai id stoered(listing banate waqt id dedo loggedin user ki)
    // newlisting ke structure me humne ek owner property create ki and usko loggedin user ki id assign krdiya . taki ppopulate ke use se ham user ko v access kr paye .
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
  isOwner,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingData = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, listingData);
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
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
