const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get("/getcookies", (req, res) => {
  res.cookie("Greet", "hello"); //name value pair Greet -> name
  // hello -> uski value
  // Cookie names cannot contain spaces or certain separators. Use a token-like name.
  res.cookie("MadeInIndia", "Namaste"); // no spaces
  res.send("send you some cookies");
});
app.use("/users", users);

app.use("/posts", posts); // yeh sare routes jo post.js me hai usko use krne k liye

app.listen(3000, () => {
  console.log("server started at port 3000");
});
