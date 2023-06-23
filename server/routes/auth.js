const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

router.get("/login/success", async (req, res) => {
  const cookie = req.cookies["jwt"];
  if (cookie) {
    const u = jwt.decode(cookie);
    const data = u["data"];

    try {
      const user = await User.findById(data["_id"]).populate("cities");

      if (!user) {
        return res.status(403).json({ error: true, message: "Forbidden!" });
      }

      const token = jwt.sign(
        {
          data: user,
        },
        "secret",
        {
          expiresIn: 60,
        }
      );

      // const b = {};

      res.cookie("jwt", token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        sameSite: "none",
      });

      return res.status(200).json({ user: user, token: token });
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Something went wrong!" });
    }
  } else {
    return res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

async function FindOrCreate(user) {
  try {
    const u = await User.findOne({ name: user["name"] });

    if (!u) {
      const us = new User();
      us.name = user["name"];
      us.displayName = user["displayName"];
      us.email = user["email"];
      us.provider = user["provider"];

      return us.save();
    }

    return u;
  } catch (error) {
    console.log(error);
  }
}

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const u = await User.findOne({ email: body["email"] }).populate("cities");
    if (!u) {
      return res.status(403).json({ message: "User does not exist!" });
    }

    if (u.provider === "manual") {
      const passMatch = await bcrypt.compare(body["password"], u.password);
      console.log(passMatch);
      if (!passMatch) {
        return res.status(403).json({ message: "Invalid Credentials!" });
      }
    }

    const token = jwt.sign(
      {
        data: u,
      },
      "secret",
      {
        expiresIn: 60,
      }
    ); // expiry in seconds
    res.cookie("jwt", token, {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true,
      sameSite: "none",
    });

    return res.status(200).json({ user: u, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;

    const u = await User.findOne({ email: body["email"] }).then((d) => d);

    if (u) {
      return res.status(403).json({ message: "User already exists!" });
    }

    const user = new User();
    user.name = body["name"];
    user.email = body["email"];

    const hashedPassword = await bcrypt.hash(body["password"], 12);

    user.password = hashedPassword;
    user.provider = "manual";

    await user.save();

    const token = jwt.sign(
      {
        data: user,
      },
      "secret",
      { expiresIn: 60 }
    ); // expiry in seconds
    res.cookie("jwt", token, {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true,
      sameSite: "none",
    });

    return res.status(201).json({ user: user, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    // console.log('redirected', req.user)
    let user = {
      displayName: req.user.displayName,
      name: req.user.name.givenName,
      email: req.user._json.email,
      provider: req.user.provider,
    };
    // console.log(user)

    const u = await FindOrCreate(user);
    let token = jwt.sign(
      {
        data: u,
      },
      "secret",
      { expiresIn: 60 }
    ); // expiry in seconds
    res.cookie("jwt", token, {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.redirect(process.env.CLIENT_URL);
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
