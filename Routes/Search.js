const express = require("express");
const router = express.Router();
const dbConnection = require("./Services/db");
const MongoClient = require("mongodb").MongoClient;
const { connectToMongoDB } = require("./Services/mongodb");
connectToMongoDB();

router.get("/", (req, res) => {
  res.render("search"); // Render the search page
});

router.post("/results", (req, res) => {
  const selectedDatabase = req.body.database;
  const make = req.body.make;

  if (selectedDatabase === "postgres") {
    // Handle PostgreSQL search
  } else if (selectedDatabase === "mongo") {
    const mongoConnectionUri = "mongodb+srv://YourMongoDBConnectionURI";

    MongoClient.connect(
      mongoConnectionUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, client) => {
        if (err) {
          console.error("Error connecting to MongoDB:", err);
          res.status(500).send("Error connecting to MongoDB");
          return;
        }

        const db = client.db("FinalSprintCars");

        try {
          const carsCollection = db.collection("cars");
          const docs = await carsCollection.find({ car_make: make }).toArray();
          res.render("results", { docs }); // Render the results page with data
        } catch (err) {
          console.error("Error executing MongoDB query:", err);
          res.status(500).send("Error fetching data from MongoDB");
        } finally {
          client.close();
        }
      }
    );
  }
});

module.exports = router;
