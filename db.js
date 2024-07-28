const mongoose = require("mongoose");
require("dotenv").config();

//Define the MongoDb connection url
const mongoUrl = process.env.MONGODB_URL_LOCAL; //fetch from .env file

//set up MongoDB connection
mongoose.connect(mongoUrl, {});

//Get the default connection
//Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

db.on("connected", () => {
  //pre defined callback function when the connection is established
  console.log("Connected to MongoDB Server");
});

db.on("error", () => {
  //pre defined callback function when the connection fails
  console.error("MongoDb connection failed");
});

db.on("disconnected", () => {
  //pre defined callback function when the connection is disconnected
  console.log("Disconnected to MongoDB Server");
});

//Export the database connection for other modules to use

module.exports = db;
