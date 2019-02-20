const express = require("express");
const bodyParser = require("body-parser");
const { BlogPosts } = require("./models");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/", (req, res) => {
  const results = BlogPosts.get();
  console.log(results);
  res.send(results);
});

router.post("/", jsonParser, (req, res) => {
  //check if required fields are in body
  requiredFields = ["title", "content", "author", "publishDate"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(
    req.body.title,
    req.body.content,
    req.body.author,
    req.body.publishDate
  );
  res.status(201).json(item);
});

router.delete("/:id", (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted ${req.params.id}`);
  res.status(204).end();
});

router.patch("/:id", jsonParser, (req, res) => {
  requiredFields = ["title", "content", "author", "publishDate"];
  var updatedItem = {};
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
    updatedItem[requiredFields[i]] = req.body[requiredFields[i]];
  }
  updatedItem["id"] = req.params.id;
  console.log(updatedItem);
  const item = BlogPosts.update(updatedItem);
  res.status(202).json(item);
});
module.exports = router;
