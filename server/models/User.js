const mongoose = require("mongoose");
const { CitySchema } = require("./City");

const schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  provider: String,
  password: String,
  fileuploaded: { type: String },
  cities: [
    {
      type: schema.Types.ObjectId,
      ref: "City",
    },
  ],
});

const User = new mongoose.model("User", UserSchema);

module.exports = User;
