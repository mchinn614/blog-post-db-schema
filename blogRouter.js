const express = require("express");
const bodyParser = require("body-parser");
const { Blog } = require("./db-model");
const mongoose = require("mongoose");

const router = express.Router();
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

// get /blog-post endpoint
router.get("/", (req, res) => {
  Blog.find(err => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
  }).then(blogs => {
    res.status(200).json({ blogs: blogs.map(blog => blog.serialize()) });
  });
});

// get /blog-post/:id endpoint
router.get("/:id", (req, res) => {
  Blog.findById(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
  }).then(blog => {
    res.send({ blog: blog.serialize() });
  });
});

// post /blog-post endpoint
router.post("/", jsonParser, (req, res) => {
  //first check if the body of the request is in the correct json format
  requiredFields = ["title", "content", "author"];
  authorFields = ["firstName", "lastName"];
  for (let i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const errorMsg = `Missing ${requiredFields[i]} in body`;
      console.log(errorMsg);
      res.status(400).send(errorMsg);
    }
  }
  for (let i = 0; i < authorFields.length; i++) {
    if (!(authorFields[i] in req.body.author)) {
      const errorMsg = `Missing ${authorFields[i]} in author`;
      console.log(errorMsg);
      res.status(400).send(errorMsg);
    }
  }
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    author: {
      firstName: req.body.author.firstName,
      lastName: req.body.author.lastName
    }
  };
  Blog.create(newPost).then(blog => {
    res.status(201).json(blog.serialize());
  });
});

// put /blog-post/:id endpoint
router.put("/:id", jsonParser, (req, res) => {
  //check if id matches
  if (!(req.params.id === req.body.id)) {
    errorMsg = `Error: id in path must equal id in request body`;
    console.log(errorMsg);
    res.status(400).send(errorMsg);
  }

  let updateObj = { id: req.params.id };
  // update fields
  possibleFields = ["title", "content", "author"];
  for (let i = 0; i < possibleFields.length; i++) {
    if (possibleFields[i] in req.body) {
      Object.assign(updateObj, {
        [possibleFields[i]]: req.body[possibleFields[i]]
      });
    }
  }
  Blog.findOneAndUpdate(
    Blog.findById(req.params.id),
    { $set: updateObj },
    { new: true }
  )
    .then(blog => {
      res.status(200).json(blog.serialize());
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).send("Something went wrong.");
    });
});

// delete /blog-post/:id endpoint
router.delete("/:id", (req, res) => {
  Blog.deleteOne({ id: req.params.id })
    .then(response => {
      if (response.ok === 1) {
        res.status(204).send(`Number of documents deleted: ${response.ok}`);
      }
    })
    .catch(err => {
      res.status(400).send("Something went wrong");
    });
});

module.exports = router;
