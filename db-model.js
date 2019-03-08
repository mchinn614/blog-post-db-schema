"use strict";
const mongoose = require("mongoose");

//define schema
const blogSchema = mongoose.Schema({
  title: String,
  content: String,
  author: {
    firstName: String,
    lastName: String
  }
});

//virtuals for author name
blogSchema.virtual("authorName").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
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
module.exports = { Blog };
