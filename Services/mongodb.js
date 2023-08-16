const { MongoClient } = require("mongodb");

const mongoConnectionUri =
  "mongodb+srv://JoshuaHayward:Gosthatsit2@cluster0.oevvccf.mongodb.net/";

let client;

async function connectToMongoDB() {
  try {
    client = new MongoClient(mongoConnectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function getMongoClient() {
  return client;
}

module.exports = { connectToMongoDB, getMongoClient };
