const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
  secret: "mysupersecreatcode",
  resave: false,
  // correct option name (express-session expects saveUninitialized)
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("hi I am root");
});

// health check route
app.get("/health", (req, res) => {
  const mongooseState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
  res.json({ status: "ok", mongooseState });
});

app.use(session(sessionOptions)); // to give session id.
app.use(flash()); // flash routes me he use horaha hai islie rotes ke // making a user model upr li8kha hai

// Passport and session initialization (top-level, not per-request)
app.use(passport.initialize());
app.use(passport.session()); // for users not to login for each page change.
passport.use(new LocalStrategy(User.authenticate())); // for authenticate all users throgh local stratergy.
passport.serializeUser(User.serializeUser()); // to store info realted to user into session
passport.deserializeUser(User.deserializeUser()); // session end hone ke baad uski info hatana hoga n .

// make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Database connection
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
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
