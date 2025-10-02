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
const ExpressError = require('./utils/ExpressError.js')
const {ListingSchema}= require("./schema.js")

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

const validateListing =(req,res,next)=>{
  let {error} = ListingSchema.validate(req.body);//listing schmea joi wala, usme ham req.body ka data dale check krne ke like ki woh sahi hai ki hai 
  if(error) {
    // listing schema do jagaha defined hai ek mongodb ke liye dusra mongo db ka data check krne ke liye thorugh joi ejs
    let errMsg = err.details.map((el)=>el.message).join(",")  // total msg ke array meh se ek ek msg seprate karega then add karega usko
    throw new ExpressError(400,errMsg)

  } else { 
    next();
  }
}

// new (upr isliye taki id ke taraha treat na ho /new {show route refrence})
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", WrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings",validateListing, WrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));



//edit route
app.get("/listings/:id/edit", WrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing, WrapAsync(async (req, res) => {
  const { id } = req.params;
  const listingData = { ...req.body.listing };
  await Listing.findByIdAndUpdate(id, listingData);// id and kya update krna hai (2 parameters mongodb ka code hai)
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", WrapAsync(async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
  console.log(deletedListing);
}));

//index route to display all listings
app.get("/listings", WrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

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

app.all('*', (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => { // upr se kisine error throw kiya woh err parameter meh save hogaya by default through express then woh err se hamne status code and msg nikala agr na ho toh by default vlaues assign krdiya .
  let {statusCode = 500 , message ="something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message})
  // res.send("something went wrong");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
