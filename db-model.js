"use strict";
const mongoose = require("mongoose");

//define schema
const blogSchema = mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  comments: [{ content: String }]
});

const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: { type: String, index: true, unique: true }
});

//pre hooks for find

blogSchema.pre("find", function(next) {
  this.populate("author");
  next();
});
blogSchema.pre("findOne", function(next) {
  this.populate("author");
  next();
});

//virtuals for author name
blogSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
});

authorSchema.virtual("authorName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

//set up custom methods
blogSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this._id
  };
};

//export model
const Blog = mongoose.model("Blog", blogSchema);
const Author = mongoose.model("Author", authorSchema);
module.exports = { Blog, Author };
