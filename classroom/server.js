const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

const cookieParser = require("cookie-parser");

app.use(cookieParser("secreatcode"));

app.get("/getsignedcookie", (req, res) => {
  res.cookie("made-In", "India", { signed: true });
  res.send(`signed cookie sent`);
});

app.get("/verify", (req, res) => {
  // to verify the cookie if someone replaces the value it prints empty string.
  // console.log(req.cookies); // normal cookies he dikhte hai isse
  console.log(req.signedCookies); // ise normal wali print nhi hogi . signed wali he hogi ......
  res.send("verified");
});

app.get("/getcookies", (req, res) => {
  res.cookie("Greet", "hello");
  res.cookie("MadeInIndia", "Namaste");
  res.send("send you some cookies");
});

app.get("/greet", (req, res) => {
  let { name = "annonymus" } = req.cookies;
  res.send(`Hi ${name}`);
});

app.get("/", (req, res) => {
  // use req.cookies to inspect parsed cookies
  console.dir(req.cookies);
  res.send("hey I am root");
});

app.use("/users", users);

app.use("/posts", posts); // yeh sare routes jo post.js me hai usko use krne k liye

app.listen(3000, () => {
  console.log("server started at port 3000");
});
