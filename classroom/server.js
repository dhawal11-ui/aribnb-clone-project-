const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

app.use(session({ secret: "mysupersecretstring", resave: false, saveUninitialized: true })); // to remove warnings (deprecated wali).

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     // creating a new variable
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times `);
// });

// app.get("/test", (req, res) => {
//   res.send("test successful");
// });

app.listen(3000, () => {
  console.log("server started at port 3000");
});
