const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const message = "This is a simple EJS website!";
  res.render("index", { message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
