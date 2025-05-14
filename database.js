const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.hdvkvlc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let database;

async function mongoConnect(callback) {
  try {
    const client = await MongoClient.connect(uri);
    database = client.db('shop');
    console.log("Connection to the database has been established.");
    callback();
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

function getDatabase() {
  if (!database) throw new Error("No database found.");
  return database;
}

module.exports = { mongoConnect, getDatabase };
