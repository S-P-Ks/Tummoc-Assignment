const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
  name: String,
});

const City = new mongoose.model("City", CitySchema);

module.exports = City;
