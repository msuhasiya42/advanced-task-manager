// @ts-nocheck
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors");

// This line imports the body-parser middleware module. It allows parsing of incoming
// request bodies in different formats, such as JSON or URL-encoded.
const bodyParser = require("body-parser");

// This line registers the built-in middleware provided by Express to parse JSON request bodies.
// It enables the server to handle requests with JSON payloads.
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// This line registers the cors middleware, enabling Cross-Origin Resource Sharing.
// It allows requests from different origins to access this server's resources.
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongodb connections
const DB = process.env.MONGODB_URL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("connection successfull");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err + "connection failed");
  });

const routes = require("./Routes");
app.use("/", routes);

// Start the server
const port = 5000;
