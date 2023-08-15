const express = require("express");
const app = express();
const path = require("path");
const dbConnection = require("./Services/db"); // Adjust the path as needed

app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/get_cars_by_make", (req, res) => {
  const make = req.query.make;
  console.log("Received request to fetch cars for make:", make); // Add this line
  const query = "SELECT * FROM car WHERE car_make = $1"; // Use $1 as a parameter placeholder
  dbConnection.query(query, [make], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Error fetching data");
    } else {
      console.log("Retrieved cars:", results.rows); // Add this line
      res.json(results.rows);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
