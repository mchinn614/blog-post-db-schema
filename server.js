var express = require("express");
var app = express();
var morgan = require("morgan");
var blog = require("./blogRouter");
const mongoose = require("mongoose");
require("dotenv").config();
const databaseUrl = process.env.DATABASE_URL;

app.use(morgan("common"));
app.use("/", blog);

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.

//add connection to mongodb
function runServer(databaseUrl) {
  const port = process.env.PORT || 8080;

  return new Promise((resolve, reject) => {
    return mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }

      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve(server);
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    mongoose.disconnect(err => {
      if (err) {
        return reject(err);
      }
      server.close(err => {
        if (err) {
          reject(err);
          // so we don't also call `resolve()`
          return;
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(databaseUrl).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
