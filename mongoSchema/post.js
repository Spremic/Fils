const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    lastName: { type: String },
    postOwnerImg: { type: Buffer },
    postOwnerID: { type: String },
    date: { type: String },
    felling: { type: String },
    description: { type: String },
    pictureUrl: { type: Buffer },
    pictureStyle: { type: String },
    likesNumber: { type: Number },
    commentsNumber: { type: Number },
    commentsName: [String],
    commentsLastName: [String],
    commentsProfilePicture:[String],
    commentsID: [String],
    comments: [String],
    commentsDate: [String],
  },
  {
    collection: "post",
  }
);

const post = mongoose.model("Post", UserSchema);

module.exports = post;
