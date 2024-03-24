const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String },
    phone: { type: String },
    description: { type: String },
    profilePicture: { type: Buffer },
    friends: [String],
    panndingFriends: [String],
    requestFriends: [String],
    postsNumber: { type: Number },
    friendsNumber: { type: Number },
    reactionsNumber: { type: Number },
    myPostsID: [String],
    myReactionsID: [String],
  },
  {
    collection: "users",
  }
);

const user = mongoose.model("User", UserSchema);

module.exports = user;
