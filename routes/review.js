const express = require("express");
const router = express.Router({ mergeParams: true }); // app.js se :id parameter nhi ara tha islie mergeParams:true likha taki parent route se params le ske
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

// validate review middleware (Joi)
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// Create review
router.post("/", validateReview, async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
});

// Delete review
router.delete("/:reviewId", async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
