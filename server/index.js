require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cityRoute = require("./routes/city");
const cookieParser = require("cookie-parser");
const passportStrategy = require("./passport");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const City = require("./models/City");
const jwt = require("jsonwebtoken");

const cities = require("./countries.json");
const User = require("./models/User");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

let project_id = `${process.env.PROJECT_ID}`;
let keyFilename = `${process.env.keyFilename}`;

const storage = new Storage({
  project_id,
  keyFilename,
});

const bucket = storage.bucket(`${process.env.YOUR_STORAGE_BUCKET}`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/city", cityRoute);

app.post("/upload", multer.single("file"), async (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      const cookie = req.cookies["jwt"];

      const u = jwt.decode(cookie);
      const userId = u.data._id;
      const user = await User.findById(userId);

      const blob = bucket.file(Date.now());

      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success");

        const publicURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        user.fileUpload = publicURL;

        user.save();
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT || 8080;

mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    app.listen(port, async () => {
      console.log(`Server started on ${port}`);

      // const u = await User.findById("6493bde607737989d1ec9295").populate(
      //   "cities"
      // );
      // console.log(u);
    });
    // await City.insertMany();
  })
  .catch((error) => console.log(error));
