const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const postSchema = require("./mongoSchema/post.js");
const userSchema = require("./mongoSchema/user.js");
const user = require("./mongoSchema/user.js");

const app = express();

app.use(express.static(__dirname + "/static/css"));
app.use(express.static(__dirname + "/static/js"));
app.use(express.static(__dirname + "/static/img"));
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/register.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/profile.html"));
});

const url = `mongodb+srv://dspremic1:FrnhB4t0oayZKb3E@cluster0.z7l71sk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const JWT_SECRET =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  w: "majority",
};
mongoose.set("strictQuery", false);
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

app.post("/api/register", async (req, res) => {
  const {
    nameInput,
    lastNameInput,
    email,
    password,
    country,
    phone,
    description,
  } = req.body;

  let validateErrors = [];

  //regex
  let regMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regPhone = /^(|\+3\d*)$/;
  if (nameInput.length < 3) {
    validateErrors.push("name");
  }

  if (lastNameInput.length < 3) {
    validateErrors.push("lastName");
  }

  if (!regMail.test(email)) {
    validateErrors.push("mail");
  }

  if (password.length === 0) {
    validateErrors.push("pass");
  }

  if (!regPhone.test(phone)) {
    validateErrors.push("phone");
  }

  console.log(validateErrors);

  if (validateErrors.length === 0) {
    let name =
      nameInput[0].toUpperCase() + nameInput.substring(1).toLowerCase();
    let lastName =
      lastNameInput[0].toUpperCase() + lastNameInput.substring(1).toLowerCase();
    try {
      const response = await userSchema.create({
        name,
        lastName,
        email,
        password,
        country,
        phone,
        description,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
      return res.json({ status: "mail" });
    }
    const findEmail = await user.findOne({ email }).lean();
    console.log("aaa" + findEmail._id);
    const token = jwt.sign(
      {
        name: findEmail.name,
        lastName: findEmail.lastName,
        email: findEmail.email,
        password: findEmail.password,
        country: findEmail.country,
        phone: findEmail.phone,
        description: findEmail.description,
        profilePicture: findEmail.profilePicture,
        friends: findEmail.friends,
        panndingFriends: findEmail.panndingFriends,
        requestFriends: findEmail.requestFriends,
        myPostsID: findEmail.myPostsID,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", token: token });
  } else {
    return res.json({ status: "validation", validateErrors });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  let findEmail = await user.findOne({ email }).lean();
  if (email === "" || password === "") {
    return res.json({ status: "err" });
  }
  if (!findEmail) {
    return res.json({ status: "err" });
  }

  if (findEmail.password === password) {
    const token = jwt.sign(
      {
        name: findEmail.name,
        lastName: findEmail.lastName,
        email: findEmail.email,
        password: findEmail.password,
        country: findEmail.country,
        phone: findEmail.phone,
        description: findEmail.description,
        profilePicture: findEmail.profilePicture,
        friends: findEmail.friends,
        panndingFriends: findEmail.panndingFriends,
        requestFriends: findEmail.requestFriends,
        myPostsID: findEmail.myPostsID,
      },
      JWT_SECRET
    );
    console.log("uspesno se ulogovao");
    return res.json({ status: "ok", token: token });
  } else {
    return res.json({ status: "err" });
  }
});

app.post("/api/dynmicLoad", (req, res) => {
  const { token } = req.body;
  try {
    const userToken = jwt.verify(token, JWT_SECRET);
    const name = userToken.name;
    const lastName = userToken.lastName;
    const email = userToken.email;
    const password = userToken.password;
    const country = userToken.country;
    const phone = userToken.phone;
    const description = userToken.description;
    const profilePicture = userToken.profilePicture;
    const friends = userToken.friends;
    const panndingFriends = userToken.panndingFriends;
    const requestFriends = userToken.requestFriends;
    const myPostsID = userToken.myPostsID;

    return res.json({
      status: "ok",
      name,
      lastName,
      email,
      password,
      country,
      phone,
      description,
      profilePicture,
      friends,
      panndingFriends,
      requestFriends,
      myPostsID,
    });
  } catch (err) {
    return res.json({ status: err });
  }
});

const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
