"use strict";
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/blog";
module.exports = DATABASE_URL;
