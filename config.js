"use strict";
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "mongodb+srv://user1:user1@cluster0-yhars.mongodb.net/blog-1?retryWrites=true";
module.exports = DATABASE_URL;
