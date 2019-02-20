var express = require("express");
var app = express();
var morgan = require("morgan");
var blog = require("./blogRouter");

app.use(morgan("common"));
app.use("/blog-post", blog);

app.listen(process.env.port || 8080, () => {
  console.log(`App is listening on port ${process.env.port || 8080}`);
});
