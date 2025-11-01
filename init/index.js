const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const { db } = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  const newData = initdata.data.map((obj) => ({ ...obj, owner: "68fa1d9925e242471745d4be" }));
  await Listing.insertMany(newData);
  console.log(newData);
  console.log("Database initialized with sample data");
};

initDB();
