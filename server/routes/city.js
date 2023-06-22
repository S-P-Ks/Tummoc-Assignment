const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const City = require("../models/City");

router.get("/", async (req, res) => {
  const page = req.query.page != null ? +req.query.page - 1 : 0;
  const limit = req.query.limit != null ? +req.query.limit : 10;

  try {
    const cities = await City.find()
      .skip(page * limit)
      .limit(limit);

    console.log(cities);

    return res.status(200).send(cities);
  } catch (error) {
    return res.status(500).send("Something went wrong!");
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const cookie = req.cookies["jwt"];

  if (cookie) {
    const u = jwt.decode(cookie);
    const data = u["data"];
    try {
      const user = await User.findById(data["_id"]).populate("cities");

      if (!user) {
        return res.status(403).json({ error: true, message: "Forbidden!" });
      }

      const r = await User.updateOne({ _id: user._id }, { cities: req.body });
      return res.status(200).send("ok");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong!");
    }
  } else {
    return res.status(403).send("Forbidden!");
  }
});

module.exports = router;
