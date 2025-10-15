const express = require("express");
const router = express.Router();

// index route
router.get("/", (req, res) => {
  res.send("Get for users !");
});

// show users
router.get("/:id", (req, res) => {
  res.send("show for users");
});

// post users
router.post("/:id", (req, res) => {
  res.send("post for users");
});

// Delete users
router.delete("/:id", (req, res) => {
  res.send("delete for users");
});

module.exports = router; // rputer object mongodb ke routes ko handle krne k liye use hoga
