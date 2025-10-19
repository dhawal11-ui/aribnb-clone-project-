const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  // user name and password passportlocalmongoose khud he define krlega (its property)
  // hasing and salting khud he aply krdeta
  email: {
    type: String,
    required: true,
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
