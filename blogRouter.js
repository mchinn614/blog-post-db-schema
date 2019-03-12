const express = require("express");
const bodyParser = require("body-parser");
const { Blog, Author } = require("./db-model");
const mongoose = require("mongoose");

const router = express.Router();
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

// get /blog-post endpoint
router.get("/posts", (req, res) => {
  Blog.find()
    .then(blogs => {
      console.log(blogs);
      res.status(200).json({ blog: blogs.map(blog => blog.serialize()) });
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send("Something went wrong.");
    });
});

// get /blog-post/:id endpoint
router.get("/posts/:id", (req, res) => {
  Blog.findOne({ _id: req.params.id })
    .then(blog => {
      if ("_id" in blog) {
        res.status(200).json({
          blog: Object.assign(blog.serialize(), { comments: blog.comments })
        });
      }
      res.status(400).send("no matching id found");
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send("Something went wrong.");
    });
});

// post /blog-post endpoint
router.post("/posts", jsonParser, (req, res) => {
  //first check if the body of the request is in the correct json format
  requiredFields = ["title", "content", "author_id"];

  for (let i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const errorMsg = `Missing ${requiredFields[i]} in body`;
      console.log(errorMsg);
      res.status(400).send(errorMsg);
    }
  }

  const newPost = {
    title: req.body.title,
    content: req.body.content,
    author: mongoose.Types.ObjectId(req.body.author_id)
  };

  Author.findById(req.body.author_id).then(author => {
    if ("_id" in author) {
      return Blog.create(newPost).then(blog => {
        Blog.findOne({ _id: blog._id }).then(blogQuery => {
          res.status(201).json(blogQuery.serialize());
        });
      });
    }
    res.status(400).send("author_id does not exist.");
  });
});

// put /blog-post/:id endpoint
router.put("/:id", jsonParser, (req, res) => {
  updateObj = {};
  // update fields
  possibleFields = ["title", "content"];
  for (let i = 0; i < possibleFields.length; i++) {
    if (possibleFields[i] in req.body) {
      Object.assign(updateObj, {
        [possibleFields[i]]: req.body[possibleFields[i]]
      });
    }
  }

  //check if id exists
  Blog.findOne({ _id: req.params.id })
    .then(blog => {
      if ("_id" in blog) {
        Blog.findOneAndUpdate(
          Blog.findOne(req.params.id),
          { $set: updateObj },
          { new: true }
        )
          .then(blog => {
            console.log("response for update endpoint", blog);
            res.status(200).json(blog.serialize());
          })
          .catch(err => {
            console.log(err.message);
            res.status(400).send("Something went wrong.");
          });
      }
      res.status(404).send("id not found");
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send("Something went wrong.");
    });
});

router.post("/authors", jsonParser, (req, res) => {
  //check if required fields are in body
  requiredFields = ["firstName", "lastName", "userName"];
  for (i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const errorMsg = `Missing ${requiredFields[i]} in body`;
      console.log(errorMsg);
      res.status(400).send(errorMsg);
    }
  }

  //check if userName is unique
  return Author.findOne({ userName: req.body.userName })
    .then(author => {
      if (!author) {
        Author.create(req.body).then(author => {
          res.status(201).json({
            _id: author._id,
            name: author.authorName,
            userName: author.userName
          });
        });
      } else {
        res.status(400).send("userName must be unique");
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send("Something went wrong.");
    });
});

// update author
router.put("/authors/:id", jsonParser, (req, res) => {
  //check if id in path matches id in body
  if (!(req.params.id === req.body.id)) {
    res.status(400).send("id in path does not match id in body");
  }

  //check for update fields in body
  updateObj = {};
  possibleFields = ["firstName", "lastName", "userName"];
  for (i = 0; i < possibleFields.length; i++) {
    if (possibleFields[i] in req.body) {
      Object.assign(updateObj, {
        [possibleFields[i]]: req.body[possibleFields[i]]
      });
    }
  }
  console.log(updateObj);
  return Author.findOne({ userName: req.body.userName }).then(checkAuthor => {
    console.log(checkAuthor);
    if (!checkAuthor) {
      return Author.findOneAndUpdate(
        Author.findOne({ _id: req.body.id }),
        {
          $set: updateObj
        },
        { new: true }
      )
        .then(author => {
          console.log(author);
          res.status(200).json({
            _id: author.id,
            name: author.authorName,
            userName: author.userName
          });
        })
        .catch(err => {
          res.status(500).send("something went wrong");
        });
    } else {
      res.status(400).send("userName already taken");
    }
  });
});

//delete author
router.delete("/authors/:id", (req, res) => {
  Author.deleteOne({ _id: req.params.id })
    .then(author => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).send("something went wrong");
    });
});

module.exports = router;
