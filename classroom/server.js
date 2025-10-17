const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

app.use(session({ secret: "mysupersecretstring" })); //middleware (ab har ek request ke sath ek session id aajayegi in the form of cookies . {any request get post put ,........})
// har browser se alag id ayegi (browser meh multiple tab khole tab change nhi hoga this counts as a single session . )
app.get("/test", (req, res) => {
  res.send("test successful");
});

app.listen(3000, () => {
  console.log("server started at port 3000");
});
