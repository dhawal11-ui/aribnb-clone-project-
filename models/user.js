const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // passport specifically for mongoose.

const userSchema = new Schema({
  // user name and password passportlocalmongoose khud he define krlega (it's property)
  // hasing and salting khud he aply krdeta
  // also adds methods . .. read documentary on npm
  //automatically username bi add kardeta hai schema ke andr . jab ham use kre toh username field insert  kr skte hai
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
