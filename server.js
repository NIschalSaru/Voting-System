const express = require("express"); // import express module
const app = express(); // create an instance of express app
const db = require("./db"); //import the database connection
require("dotenv").config(); // import environment variables from.env file
const usersRouter = require("./routes/userRoutes"); // import users routes
const candidateRouter = require("./routes/candidateRoutes"); // import users routes
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use("/user", usersRouter);
app.use("/candidate", candidateRouter);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
