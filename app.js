const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { wrap } = require("module");
const listings = require("./routes/listing.js");
const Reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecreatcode",
  resave: false,
  saveUninitialised: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // by default false hota hai islie true krdia taki client side script se cookie access na ho ske. (cross-site scripting attacks se bacha ja ske)
  },
};

app.get("/", (req, res) => {
  res.send("hi I am root");
});

app.use(session(sessionOptions)); // to give session id.
app.use(flash()); // flash routes me he use horaha hai islie rotes ke upr li8kha hai

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

//Database connection
app.use("/listings", listings);
app.use("/listings/:id/reviews", Reviews);

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

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
