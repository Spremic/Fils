const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const postSchema = require("./mongoSchema/post.js");
const user = require("./mongoSchema/user.js");
const post = require("./mongoSchema/post.js");

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

app.get("/complete", (req, res) => {
  res.sendFile(path.join(__dirname, "/static/picture.html"));
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
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
  let postsNumber = 0;
  let friendsNumber = 0;
  let reactionsNumber = 0;
  let myReactionsID;
  let profilePicture = "";
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

  if (validateErrors.length === 0) {
    let name =
      nameInput[0].toUpperCase() + nameInput.substring(1).toLowerCase();
    let lastName =
      lastNameInput[0].toUpperCase() + lastNameInput.substring(1).toLowerCase();
    try {
      const response = await user.create({
        name,
        lastName,
        email,
        password,
        country,
        phone,
        description,
        profilePicture,
        postsNumber,
        friendsNumber,
        reactionsNumber,
        myReactionsID,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
      return res.json({ status: "mail" });
    }
    const findEmail = await user.findOne({ email }).lean();
    const token = jwt.sign(
      {
        id: findEmail._id,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", token: token });
  } else {
    return res.json({ status: "validation", validateErrors });
  }
});

app.post(
  "/api/profilePicture",
  upload.single("picture"),
  async function (req, res) {
    if (req.file) {
      try {
        const imagePath = req.file.buffer;
        const userToken = jwt.verify(req.body.token, JWT_SECRET);
        const addProfileImage = await user.updateOne(
          { _id: userToken.id },
          { $set: { profilePicture: imagePath } }
        );

        return res.json({ status: "ok" });
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  }
);

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
        id: findEmail._id,
      },
      JWT_SECRET
    );
    return res.json({ status: "ok", token: token });
  } else {
    return res.json({ status: "err" });
  }
});

app.post("/api/dynmicLoad", async (req, res) => {
  const { token } = req.body;

  //name, lastname, email, send to front
  const allNameObject = await user.find({}, { name: 1, _id: 0 });
  const allName = allNameObject.map((user) => user.name);

  const allLastNameObject = await user.find({}, { lastName: 1, _id: 0 });
  const allLastName = allLastNameObject.map((user) => user.lastName);

  const allprofilePictureObject = await user.find(
    {},
    { profilePicture: 1, _id: 0 }
  );
  const allProfilePicture = allprofilePictureObject.map(
    (user) => user.profilePicture
  );
  const base64Images = allProfilePicture.map(
    (imageBuffer) => `data:image/jpeg;base64,${imageBuffer.toString("base64")}`
  );

  const allPostNumberObject = await user.find({}, { postsNumber: 1, _id: 0 });
  const allPostNumber = allPostNumberObject.map((user) => user.postsNumber);

  const allIdsObject = await user.find({}, { _id: 1 });
  const allIds = allIdsObject.map((user) => user._id);

  //token information
  const userToken = jwt.verify(token, JWT_SECRET);

  const _id = userToken.id;

  const idCheck = await user.findOne({ _id }).lean();
  const id = idCheck._id;
  const name = idCheck.name;
  const lastName = idCheck.lastName;
  const email = idCheck.email;
  const password = idCheck.password;
  const country = idCheck.country;
  const phone = idCheck.phone;
  const description = idCheck.description;
  const profilePicture = `data:image/jpeg;base64,${idCheck.profilePicture.toString(
    "base64"
  )}`;

  const friends = idCheck.friends;
  const panndingFriends = idCheck.panndingFriends;
  const requestFriends = idCheck.requestFriends;
  const postsNumber = idCheck.postsNumber;
  const friendsNumber = idCheck.friendsNumber;
  const reactionsNumber = idCheck.reactionsNumber;
  const myPostsID = idCheck.myPostsID;
  const myReactionsID = idCheck.myReactionsID;

  //search name of friends, mail,chat,id...
  let findEmail = await user.findOne({ email }).lean();
  let friendsArrayEmail = findEmail.friends;
  let findFriends = await user
    .find({ email: { $in: friendsArrayEmail } })
    .lean();
  let friendsNames = findFriends.map((item) => item.name);
  let friendsLastName = findFriends.map((item) => item.lastName);
  let friendsId = findFriends.map((item) => item._id);

  const searchAllPost = await postSchema.find();
  const allPost = searchAllPost.map((doc) => {
     
    return {
      id: doc._id,
      name: doc.name,
      lastName: doc.lastName,
      postOwnerImg: `data:image/jpeg;base64,${doc.postOwnerImg.toString(
        "base64"
      )}`,
      postOwnerID: doc.postOwnerID,
      date: doc.date,
      felling: doc.felling,
      description: doc.description,
      pictureUrl: `data:image/jpeg;base64,${doc.pictureUrl.toString("base64")}`,
      pictureStyle: doc.pictureStyle,
      likesNumber: doc.likesNumber,
      commentsNumber: doc.commentsNumber,
      commentsName: doc.commentsName,
      commentsLastName: doc.commentsLastName,
      commentsProfilePicture: doc.commentsProfilePicture,
      commentsID: doc.commentsID,
      comments: doc.comments,
      commentsDate: doc.commentsDate,
    };
  });

  //feedback
  return res.json({
    status: "ok",
    id,
    name,
    lastName,
    profilePicture,
    email,
    password,
    country,
    phone,
    description,
    friends,
    panndingFriends,
    requestFriends,
    postsNumber,
    friendsNumber,
    reactionsNumber,
    myPostsID,
    allName,
    allLastName,
    base64Images,
    allIds,
    allPostNumber,
    friendsNames,
    friendsLastName,
    friendsId,
    allPost,

    myReactionsID,
  });
});
app.post("/api/addPost", upload.single("picture"), async function (req, res) {
  let pictureUrl;
  let pictureStyle;
  if (req.file) {
    const imagePath = req.file.buffer;
    pictureUrl = imagePath;
    pictureStyle = "block";
  } else {
    pictureUrl = "";
    pictureStyle = "none";
  }

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();
  const token = req.body.token;
  const userToken = jwt.verify(token, JWT_SECRET);
  const _id = userToken.id;
  const idCheck = await user.findOne({ _id }).lean();

  const name = idCheck.name;
  const lastName = idCheck.lastName;
  const postOwnerImg = idCheck.profilePicture;
  const postOwnerID = idCheck._id;
  const date = `${day}.${month}.${year}.`.trim();
  let felling = req.body.felling;
  const description = req.body.description;
  const likesNumber = 0;
  const commentsNumber = 0;

  try {
    //create schema
    const response = await postSchema.create({
      name,
      lastName,
      postOwnerImg,
      postOwnerID,
      date,
      felling,
      description,
      pictureUrl,
      pictureStyle,
      likesNumber,
      commentsNumber,
    });

    //push post id to creater
    const postId = response._id;
    const updateId = await user.updateOne(
      { _id: postOwnerID },
      { $push: { myPostsID: postId } }
    );

    //add 1+ to posts number
    let userNumberPost = idCheck.postsNumber;
    let newNumberValue = userNumberPost + 1;
    const updateNumberPost = await user.updateOne(
      { _id: postOwnerID },
      { $set: { postsNumber: newNumberValue } }
    );
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/likePost", async (req, res) => {
  const { id, token } = req.body;
  const userToken = jwt.verify(token, JWT_SECRET);
  const userProfile = await user.findOne({ _id: userToken.id });
  const findSchema = await postSchema.findOne({ _id: id });

  try {
    //add post ID to users who likes
    const updateReactionsID = await user.updateOne(
      { _id: userToken.id },
      { $push: { myReactionsID: id } }
    );

    //update user reaction number
    let userReactionNumber = userProfile.reactionsNumber;
    let newUserReactionNumber = userReactionNumber + 1;
    const updateReactionNumber = await user.updateOne(
      { _id: userToken.id },
      { $set: { reactionsNumber: newUserReactionNumber } }
    );

    //update post reaction number
    let postReactionNumber = findSchema.likesNumber;
    let newPostReactionNumber = postReactionNumber + 1;
    const updatePostReactionNumber = await postSchema.updateOne(
      { _id: id },
      { $set: { likesNumber: newPostReactionNumber } }
    );

    return res.json({
      status: "ok",
      newPostReactionNumber,
      newUserReactionNumber,
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: "err" });
  }
});

app.post("/api/unlikePost", async (req, res) => {
  const { token, id } = req.body;
  const userToken = jwt.verify(token, JWT_SECRET);
  const userProfile = await user.findOne({ _id: userToken.id });
  const findSchema = await postSchema.findOne({ _id: id });

  try {
    //delete ID to users who likes
    const updateReactionsID = await user.updateOne(
      { _id: userToken.id },
      { $pull: { myReactionsID: id } }
    );

    //update user reaction number
    let userReactionNumber = userProfile.reactionsNumber;
    let newUserReactionNumber = userReactionNumber - 1;
    const updateReactionNumber = await user.updateOne(
      { _id: userToken.id },
      { $set: { reactionsNumber: newUserReactionNumber } }
    );

    //update post reaction number
    let postReactionNumber = findSchema.likesNumber;
    let newPostReactionNumber = postReactionNumber - 1;
    const updatePostReactionNumber = await postSchema.updateOne(
      { _id: id },
      { $set: { likesNumber: newPostReactionNumber } }
    );

    return res.json({
      status: "ok",
      newPostReactionNumber,
      newUserReactionNumber,
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: "err" });
  }
});

app.post("/api/addComment", async (req, res) => {
  const { postID, input, token } = req.body;
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();
  const date = `${day}.${month}.${year}.`.trim();
  const userToken = jwt.verify(token, JWT_SECRET);
  const userSchema = await user.findOne({ _id: userToken.id });
  const userName = userSchema.name;
  const userLastName = userSchema.lastName;
  const userID = userSchema._id;
  const commentsProfilePicture = `data:image/jpeg;base64,${userSchema.profilePicture.toString(
    "base64"
  )}`;


  const findPostSchema = await postSchema.findOne({ _id: postID });
  if (input.trim() === "") {
    return res.json({ status: "validation" });
  }

  try {
    const pushData = await postSchema.updateOne(
      { _id: postID },
      {
        $push: {
          commentsName: userName,
          commentsLastName: userLastName,
          commentsID: userID,
          comments: input,
          commentsDate: date,
          commentsProfilePicture: commentsProfilePicture,
        },
      }
    );

    const commentsNumber = findPostSchema.commentsNumber;
    let newCommentsNumber = commentsNumber + 1;
    const updateCommentNumber = await postSchema.updateOne(
      { _id: postID },
      { $set: { commentsNumber: newCommentsNumber } }
    );

    return res.json({
      status: "ok",
      newCommentsNumber,
      commentsName: userName,
      commentsLastName: userLastName,
      commentsID: userID,
      comments: input,
      commentsDate: date,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/addFriend", async (req, res) => {
  const { token, userID } = req.body;
  // "USER" is the person who sent the friend request, while "FRIEND" is the person to whom the request was sent.
  const userToken = jwt.verify(token, JWT_SECRET);

  const existingUser = await user.findOne({
    _id: userToken.id,
    panndingFriends: { $in: [userID] },
  });

  if (existingUser) {
    return res.json({ status: "existingUser" });
  } else {
    try {
      const pushPadding = await user.updateOne(
        { _id: userToken.id },
        { $push: { panndingFriends: userID } }
      );

      const pushRequest = await user.updateOne(
        { _id: userID },
        { $push: { requestFriends: userToken.id } }
      );
      return res.json({ status: "ok" });
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/api/removePaddingFriend", async (req, res) => {
  const { token, userID } = req.body;
  const userToken = jwt.verify(token, JWT_SECRET);

  try {
    const removePadding = await user.updateOne(
      { _id: userToken.id },
      { $pull: { panndingFriends: userID } }
    );

    const removeRequest = await user.updateOne(
      { _id: userID },
      { $pull: { requestFriends: userToken.id } }
    );
    return res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/acceptFriend", async (req, res) => {
  const { token, userID } = req.body;
  const userToken = jwt.verify(token, JWT_SECRET);
  try {
    const removeRequest = await user.updateOne(
      { _id: userToken.id },
      { $pull: { requestFriends: userID } }
    );

    const userUpdateFriend = await user.updateOne(
      { _id: userToken.id },
      { $push: { friends: userID } }
    );

    const removePadding = await user.updateOne(
      { _id: userID },
      { $pull: { panndingFriends: userToken.id } }
    );

    const friendUpdateFriend = await user.updateOne(
      { _id: userID },
      { $push: { friends: userToken.id } }
    );
    return res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteFriends", async (req, res) => {
  const { token, userID } = req.body;
  const userToken = jwt.verify(token, JWT_SECRET);

  try {
    const removeFriend = await user.updateOne(
      { _id: userToken.id },
      { $pull: { friends: userID } }
    );

    const friendRemoveFreind = await user.updateOne(
      { _id: userID },
      { $pull: { friends: userID } }
    );

    return res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
