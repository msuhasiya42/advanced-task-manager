// @ts-nocheck
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const cors = require("cors");
app.use(cors());

// This line imports the body-parser middleware module. It allows parsing of incoming
// request bodies in different formats, such as JSON or URL-encoded.
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// This line registers the built-in middleware provided by Express to parse JSON request bodies.
// It enables the server to handle requests with JSON payloads.
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// This line registers the cors middlewarre, enabling Cross-Origin Resource Sharing.
// It allows requests from different origins to access this server's resources.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

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
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err + "connection failed");
  });

const routes = require("./Routes");
app.use("/", routes);

// Start the server