const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

// app.use("/", users);  // aisa v likh sakte hai
app.use("/users", users); // yeh sare routes jo user.js me hai usko use krne k liye
// herer user is an object jisme sare routes hai
// user.js ke routes se common part hatakar yaha rakhdiya

app.use("/posts", posts); // yeh sare routes jo post.js me hai usko use krne k liye

app.listen(3000, () => {
  console.log("server started at port 3000");
});
