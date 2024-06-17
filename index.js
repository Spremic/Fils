const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
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
  const regPhone = /^(\+3\d*)?$/;
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
  const { cloneToken } = req.body;

  //Registered user
  const userToken = jwt.verify(cloneToken, JWT_SECRET);
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

  //Recommendeds profiles send to front
  const lastFourUsers = await user.find({}).sort({ _id: -1 }).limit(4);
  const lastFourNames = lastFourUsers.map((user) => user.name);
  const lastFourLastNames = lastFourUsers.map((user) => user.lastName);
  const lastFourPictures = lastFourUsers.map((user) => {
    return `data:image/jpeg;base64,${user.profilePicture.toString("base64")}`;
  });
  const lastFourPostNumber = lastFourUsers.map((user) => user.postsNumber);
  const lastFourIds = lastFourUsers.map((user) => user._id);

  //search name of friends, mail,chat,id...
  let findEmail = await user.findOne({ email }).lean();
  let friendsArrayEmail = findEmail.friends;
  let findFriends = await user.find({ _id: { $in: friendsArrayEmail } }).lean();
  let friendsNames = findFriends.map((item) => item.name);
  let friendsLastName = findFriends.map((item) => item.lastName);
  let friendsId = findFriends.map((item) => item._id);
  const friendsImg = findFriends.map((item) => {
    return `data:image/jpeg;base64,${item.profilePicture.toString("base64")}`;
  });

  //all posts info
  const searchAllPost = await post.find();
  let postsOwnersIds = searchAllPost.map((item) => item.postOwnerID);
  const usersSchemaPromises = postsOwnersIds.map((id) => user.findById(id));
  const usersSchemas = await Promise.all(usersSchemaPromises);
  const postName = usersSchemas.map((user) => user.name);
  const postLastName = usersSchemas.map((user) => user.lastName);
  const postOwnerImg = usersSchemas.map((user) => {
    return `data:image/jpeg;base64,${user.profilePicture.toString("base64")}`;
  });
  const postOwnerID = usersSchemas.map((user) => user._id);
  const postsIds = searchAllPost.map((post) => post._id);
  const postDate = searchAllPost.map((post) => post.date);
  const postFelling = searchAllPost.map((post) => post.felling);
  const postDescription = searchAllPost.map((post) => post.description);
  const postPicture = searchAllPost.map((post) => {
    return `data:image/jpeg;base64,${post.pictureUrl.toString("base64")}`;
  });
  const postPictureStyle = searchAllPost.map((post) => post.pictureStyle);
  const likesNumber = searchAllPost.map((post) => post.likesNumber);
  const commentsNumber = searchAllPost.map((post) => post.commentsNumber);

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
    lastFourNames,
    lastFourLastNames,
    lastFourPictures,
    lastFourPostNumber,
    lastFourIds,
    friendsNames,
    friendsLastName,
    friendsId,
    friendsImg,
    myReactionsID,

    // POSTS
    postName,
    postLastName,
    postOwnerImg,
    postOwnerID,
    postDate,
    postFelling,
    postDescription,
    postPicture,
    likesNumber,
    commentsNumber,
    postsIds,
    postPictureStyle,
  });
});

app.post("/api/profileDynmicLoad", async (req, res) => {
  const { cloneToken } = req.body;
  const userToken = jwt.verify(cloneToken, JWT_SECRET);
  try {
    const userSchema = await user.findOne({ _id: userToken.id });
    const id = userSchema.id;
    const name = userSchema.name;
    const lastName = userSchema.lastName;
    const profilePicture = `data:image/jpeg;base64,${userSchema.profilePicture.toString(
      "base64"
    )}`;
    const postsNumber = userSchema.postsNumber;
    const friendsNumber = userSchema.friendsNumber;
    const reactionsNumber = userSchema.reactionsNumber;
    const description = userSchema.description;
    const joined = "15.02.2023";
    const email = userSchema.email;
    const country = userSchema.country;
    const phone = userSchema.phone;

    //friends information
    const friendsId = userSchema.friends;
    const friendSchema = await user.find({ _id: { $in: friendsId } });
    const friendsImg = friendSchema.map((friends) => {
      return `data:image/jpeg;base64,${friends.profilePicture.toString(
        "base64"
      )}`;
    });
    const friendsNames = friendSchema.map((friends) => friends.name);
    const friendsLastName = friendSchema.map((friends) => friends.lastName);
    //posts
    const postsIds = userSchema.myPostsID;
    const postsSchemas = await post.find({ _id: { $in: postsIds } });
    const postOwnerImg = [profilePicture];
    const postOwnerID = [id];
    const postName = [name];
    const postLastName = [lastName];
    const postDate = postsSchemas.map((post) => post.date);
    const postFelling = postsSchemas.map((post) => post.felling);
    const postDescription = postsSchemas.map((post) => post.description);
    const postPictureStyle = postsSchemas.map((post) => post.pictureStyle);
    const postPicture = postsSchemas.map((post) => {
      return `data:image/jpeg;base64,${post.pictureUrl.toString("base64")}`;
    });
    const likesNumber = postsSchemas.map((post) => post.likesNumber);
    const commentsNumber = postsSchemas.map((post) => post.commentsNumber);
    const myReactionsID = userSchema.myReactionsID;

    return res.json({
      status: "ok",
      //user
      id,
      name,
      lastName,
      profilePicture,
      postsNumber,
      friendsNumber,
      reactionsNumber,
      description,
      joined,
      email,
      country,
      phone,

      //friends
      friendsId,
      friendsImg,
      friendsNames,
      friendsLastName,

      //post
      postsIds,
      postsSchemas,
      postOwnerImg,
      postOwnerID,
      postName,
      postLastName,
      postDate,
      postFelling,
      postDescription,
      postPictureStyle,
      postPicture,
      likesNumber,
      commentsNumber,
      myReactionsID,
    });
  } catch (err) {
    console.log(err);
  }
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
  const token = req.body.cloneToken;
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
    const response = await post.create({
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
  const { id, cloneToken } = req.body;
  const userToken = jwt.verify(cloneToken, JWT_SECRET);
  const userProfile = await user.findOne({ _id: userToken.id });
  const findSchema = await post.findOne({ _id: id });

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
    const updatePostReactionNumber = await post.updateOne(
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
  const { cloneToken, id } = req.body;
  const userToken = jwt.verify(cloneToken, JWT_SECRET);
  const userProfile = await user.findOne({ _id: userToken.id });
  const findSchema = await post.findOne({ _id: id });

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
    const updatePostReactionNumber = await post.updateOne(
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
  const { postID, input, cloneToken } = req.body;
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();
  const date = `${day}.${month}.${year}.`.trim();
  const userToken = jwt.verify(cloneToken, JWT_SECRET);
  const userSchema = await user.findOne({ _id: userToken.id });
  const userName = userSchema.name;
  const userLastName = userSchema.lastName;
  const userID = userSchema._id;

  const findPostSchema = await post.findOne({ _id: postID });
  if (input.trim() === "") {
    return res.json({ status: "validation" });
  }

  try {
    const pushData = await post.updateOne(
      { _id: postID },
      {
        $push: {
          commentsID: userID,
          comments: input,
          commentsDate: date,
        },
      }
    );

    const commentsNumber = findPostSchema.commentsNumber;
    let newCommentsNumber = commentsNumber + 1;
    const updateCommentNumber = await post.updateOne(
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

app.post("/api/loadComments", async (req, res) => {
  const { postID } = req.body;
  try {
    const postSchema = await post.findOne({ _id: postID });
    const usersIds = postSchema.commentsID;
    const usersSchemaPromises = usersIds.map((id) => user.findById(id));
    const usersSchemas = await Promise.all(usersSchemaPromises);
    const names = usersSchemas.map((user) => user.name);
    const lastNames = usersSchemas.map((user) => user.lastName);
    const comments = postSchema.comments;
    const length = comments.length;
    const profilePictures = usersSchemas.map((user) => {
      return `data:image/jpeg;base64,${user.profilePicture.toString("base64")}`;
    });
    const date = postSchema.commentsDate;
    console.log(comments);
    return res.json({
      status: "ok",
      names,
      lastNames,
      profilePictures,
      date,
      usersIds,
      comments,
      length,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/addFriend", async (req, res) => {
  const { cloneToken, userID } = req.body;
  // "USER" is the person who sent the friend request, while "FRIEND" is the person to whom the request was sent.
  const userToken = jwt.verify(cloneToken, JWT_SECRET);

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
  const { cloneToken, userID } = req.body;
  const userToken = jwt.verify(cloneToken, JWT_SECRET);

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
  const { cloneToken, userID } = req.body;
  const userToken = jwt.verify(cloneToken, JWT_SECRET);
  try {
    const userSchema = await user.findOne({ _id: userToken.id });
    const friendSchema = await user.findOne({ _id: userID });

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

    const friendOldValue = friendSchema.friendsNumber;
    const friendNewValue = friendOldValue + 1;
    const updateFriendNumber = await user.updateOne(
      { _id: userID },
      { $set: { friendsNumber: friendNewValue } }
    );

    const userOldValue = userSchema.friendsNumber;
    const userNewValue = userOldValue + 1;
    const updateUserValue = await user.updateOne(
      { _id: userToken.id },
      { $set: { friendsNumber: userNewValue } }
    );

    return res.json({ status: "ok", userNewValue });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/deleteFriends", async (req, res) => {
  const { cloneToken, userID } = req.body;
  const userToken = jwt.verify(cloneToken, JWT_SECRET);

  try {
    const userSchema = await user.findOne({ _id: userToken.id });
    const friendSchema = await user.findOne({ _id: userID });

    const removeFriend = await user.updateOne(
      { _id: userToken.id },
      { $pull: { friends: userID } }
    );

    const friendRemoveFreind = await user.updateOne(
      { _id: userID },
      { $pull: { friends: userToken.id } }
    );

    const friendOldValue = friendSchema.friendsNumber;
    const friendNewValue = friendOldValue - 1;
    const updateFriendNumber = await user.updateOne(
      { _id: userID },
      { $set: { friendsNumber: friendNewValue } }
    );

    const userOldValue = userSchema.friendsNumber;
    const userNewValue = userOldValue - 1;
    const updateUserValue = await user.updateOne(
      { _id: userToken.id },
      { $set: { friendsNumber: userNewValue } }
    );

    return res.json({ status: "ok", userNewValue });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/sendAllUsersInfo", async (req, res) => {
  const { cloneToken } = req.body;
  const token = jwt.verify(cloneToken, JWT_SECRET);
  try {
    const loginUserSchema = await user.findOne({ _id: token.id });
    const panndingFriends = loginUserSchema.panndingFriends;
    const requestFriends = loginUserSchema.requestFriends;
    const friends = loginUserSchema.friends;
    const usersSchemas = await user.find();
    const name = usersSchemas.map((users) => users.name);
    const lastNames = usersSchemas.map((users) => users.lastName);
    const ids = usersSchemas.map((users) => users._id);

    const profilePictures = usersSchemas.map((users) => {
      return `data:image/jpeg;base64,${users.profilePicture.toString(
        "base64"
      )}`;
    });

    return res.json({
      status: "ok",
      name,
      lastNames,
      ids,
      profilePictures,
      panndingFriends,
      requestFriends,
      friends,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/editProfileData", async (req, res) => {
  const {
    cloneToken,
    newName,
    newLastName,
    newEmail,
    newPassword,
    newCountry,
    newPhone,
    newAboutMe,
    confrimPassValue,
  } = req.body;

  const token = jwt.verify(cloneToken, JWT_SECRET);
  const userSchema = await user.findOne({ _id: token.id });
  const pass = userSchema.password;
  if (confrimPassValue !== pass) {
    console.log("nije isti");
    return res.json({ status: "password" });
  }

  let checkPassword;
  const regMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regPhone = /^(\+3\d*)?$/;

  if (!/^\*+$/.test(newPassword.trim())) {
    checkPassword = newPassword;
  } else {
    checkPassword = pass;
  }

  if (newName.length < 3) {
    return;
  }
  if (newLastName.length < 3) {
    return;
  }
  if (!regMail.test(newEmail)) {
    return;
  }
  if (!regPhone.test(newPhone)) {
    return;
  }

  try {
    const updateFields = {
      name: newName,
      lastName: newLastName,
      email: newEmail,
      password: checkPassword,
      country: newCountry,
      phone: newPhone,
      description: newAboutMe,
    };

    await user.updateOne({ _id: token.id }, { $set: updateFields });
    return res.json({ status: "ok" });
  } catch (err) {
    return res.json({ status: "mail" });
  }
});

app.post("/api/deleteProfileData", async (req, res) => {
  const { cloneToken, confrimPassValue } = req.body;
  const token = jwt.verify(cloneToken, JWT_SECRET);
  const userSchema = await user.findOne({ _id: token.id });
  const pass = userSchema.password;

  if (confrimPassValue !== pass) {
    console.log("nije isti");
    return res.json({ status: "password" });
  }

  try {
    const allFriends = userSchema.friends;
    const allReactions = userSchema.myReactionsID;
    const findComments = await post.find({ commentsID: token.id });
    const postsIds = findComments.map((post) => post._id);
    const deleteComments = await post.updateMany(
      { _id: postsIds },
      { $pull: { commentsID: token.id } }
    );

    const deleteFriends = await user.updateMany(
      { _id: allFriends },
      {
        $pull: { friends: token.id },
        $inc: { friendsNumber: -1 },
      }
    );

    const deleteReactions = await post.updateMany(
      { _id: allReactions },
      { $inc: { likesNumber: -1 } }
    );

    const deleteUser = await user.deleteOne({ _id: token.id });
    const deletePost = await post.deleteMany({ postOwnerID: token.id });

    return res.json({ status: "profileDeleted" });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
