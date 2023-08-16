const express = require("express");
const app = express();
const path = require("path");
const dbConnection = require("./Services/db"); // Adjust the path as needed
const MongoClient = require("mongodb").MongoClient;
const { connectToMongoDB } = require("./Services/mongodb");
connectToMongoDB();

app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/get_cars_by_make", (req, res) => {
  const selectedDatabase = req.query.database;
  const make = req.query.make;
  console.log("Received request to fetch cars for make:", make);
  console.log("Selected database:", selectedDatabase);

  if (selectedDatabase === "postgres") {
    const query = "SELECT * FROM car WHERE car_make = $1";
    dbConnection.query(query, [make], (error, results) => {
      if (error) {
        console.error("Error executing PostgreSQL query:", error);
        res.status(500).send("Error fetching data");
      } else {
        console.log("Retrieved cars from PostgreSQL:", results.rows);
        res.json(results.rows);
      }
    });
  } else if (selectedDatabase === "mongo") {
    const mongoConnectionUri =
      "mongodb+srv://JoshuaHayward:Gosthatsit2@cluster0.oevvccf.mongodb.net/";

    MongoClient.connect(
      mongoConnectionUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, client) => {
        if (err) {
          console.error("Error connecting to MongoDB:", err);
          res.status(500).send("Error connecting to MongoDB");
          return;
        }

        console.log("Connected to MongoDB");
        const db = client.db("FinalSprintCars");

        try {
          const carsCollection = db.collection("cars");
          const docs = await carsCollection.find("car_make").toArray();

          console.log("Retrieved cars from MongoDB:", docs);
          res.json(docs);
        } catch (err) {
          console.error("Error executing MongoDB query:", err);
          res.status(500).send("Error fetching data from MongoDB");
        } finally {
          client.close();
        }
      }
    );
  } else {
    console.log("Invalid database selection:", selectedDatabase);
    res.status(400).send("Invalid database selection");
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
