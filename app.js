const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync");
const WrapAsync = require("./utils/WrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { wrap } = require("module");
const listings = require("./routes/listing.js");

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("hi I am root");
});

app.use("/listings", listings);

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    // listing schema do jagaha defined hai ek mongodb ke liye dusra mongo db ka data check krne ke liye thorugh joi ejs
    let errMsg = error.details.map((el) => el.message).join(","); // total msg ke array meh se ek ek msg seprate karega then add karega usko
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//post review route
app.post(
  "/listings/:id/reviews",
  validateReview,
  WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview); // listings schema meh reviews array hai usme push krdia new review ko

    await newReview.save();
    await listing.save();

    console.log("new review added");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete review route
app.delete(
  "/listings/:id/reviews/:reviewId", // form request bhejega and yeh route catch karega .
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // yeh mongoose ka operator hai jisme ham reviews array meh se us particular review id ko hatayenge
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New villa ",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute , goa",
//     country: "India",
//   });

//   await sampleListing
//     .save()
//     .then(() => {
//       res.send("Listing saved successfully");
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send("Error saving listing");
//     });
//   console.log("sample was saved successfully");
//   res.send("Listing saved successfully");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  // upr se kisine error throw kiya woh err parameter meh save hogaya by default through express then woh err se hamne status code and msg nikala agr na ho toh by default vlaues assign krdiya .
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.send("something went wrong");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
