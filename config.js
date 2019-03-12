"use strict";
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/blog";
module.exports = DATABASE_URL;
