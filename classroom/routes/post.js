const express = require("express");
const app = express();
const router = express.Router();

//posts
// index route
router.get("/", (req, res) => {
  res.send("Get for posts !");
});

// show posts
router.get("/:id", (req, res) => {
  res.send("show for posts");
});

// post users
router.post("/:id", (req, res) => {
  res.send("post for posts");
});

// Delete posts
router.delete("/:id", (req, res) => {
  res.send("delete for posts");
});

module.exports = router;
