const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

const cookieParser = require("cookie-parser");

// cookieParser is a function that returns middleware — call it here  (hamne jo users ko req bheja yane parent element toh usper se :id ki value nhi aarhi thi isliye humne cookie parser use kiya . Nhi use krte toh undefined aajata)
app.use(cookieParser()); // to decode (parse) cookie into req.cookies

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
