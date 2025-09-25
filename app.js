const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

// new (upr isliye taki id ke taraha treat na ho /new {show route refrence})
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
  console.log(deletedListing);
});

//index route to display all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

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

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
